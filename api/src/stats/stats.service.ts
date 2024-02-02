import { Inject, Injectable } from "@nestjs/common";
import { Stats, TimestampValue } from "./types.js";
import { ClickhouseService } from "../clickhouse/clickhouse.service.js";
import { OlService } from "../ol/ol.service.js";

@Injectable()
export class StatsService {
  @Inject()
  private readonly clickhouseService: ClickhouseService;

  @Inject()
  private readonly olService: OlService;

  public async getStats() /* : Promise<Stats> */ {
    // const communityWallets = await this.olService.getCommunityWallets();
    // console.log(communityWallets);

    // const totalSupply = await this.getTotalSupply(); // DONE
    // const slowWalletsOverTime = await this.getSlowWalletsOverTime(); // DONE
    // const burnsOverTime = await this.getBurnsOverTime(); // DONE
    const accountsOnChainOverTime = await this.getAccountsOnChainOverTime(); // DONE

    console.log(accountsOnChainOverTime);




    const totalSlowWalletLocked = 0;
    // return { totalSupply, totalSlowWalletLocked };

    // const totalSupply = await this.getTotalSupply();
    // const slowWallets = await this.getSlowWallets();

    // const slowWalletAddresses = slowWallets.map((it) => it.address);

    // const slowWalletBalances = await this.getWalletsBalances(slowWalletAddresses);

    // const slowWalletsMap = new Map(
    //   slowWallets.map((it) => [it.address, it])
    // );
    // const slowWalletBalancesMap = new Map(
    //   slowWalletBalances.map((it) => [it.address, it.balance]),
    // );

    // const totalSlowWalletLocked = Array.from(slowWalletBalancesMap.keys()).map(
    //   (address) => {
    //     return (
    //       slowWalletBalancesMap.get(address)! -
    //       slowWalletsMap.get(address)!.unlocked
    //     );
    //   },
    // ).reduce((prev, curr) => prev + curr, 0);

    // return { totalSupply, totalSlowWalletLocked };
  }

  private async getWalletsBalances(addresses: string[]) {
    if (addresses.length === 0) {
      return [];
    }

    const query = `
      SELECT
        tupleElement("entry", 2) / 1e6 AS "balance",
        hex(tupleElement("entry", 3)) AS "address"
        FROM (
          SELECT
            arrayElement(
              arraySort(
                (x) -> tupleElement(x, 1) ,
                groupArray(
                  tuple(
                    "version",
                    "balance",
                    "address"
                  )
                )
              ),
              -1
            ) AS "entry"
          FROM "coin_balance"
          WHERE
            has(
              arrayMap(
                x -> reinterpretAsUInt256(reverse(unhex(x))),
                {addresses: Array(String)}
              ),
              "address" 
            )
          GROUP BY "address"
        )
    `;

    const resultSet = await this.clickhouseService.client.query({
      query,
      query_params: {
        addresses,
      },
      format: "JSONEachRow",
    });
    const rows = await resultSet.json<
      {
        balance: number;
        address: string;
      }[]
    >();

    return rows;
  }

  private async getSlowWallets(): Promise<
    {
      address: string;
      unlocked: number;
      transferred: number;
    }[]
  > {
    const query = `
      SELECT
        hex(tupleElement("entry", 2)) AS "address",
        tupleElement("entry", 3) / 1e6 AS "unlocked",
        tupleElement("entry", 4) / 1e6 AS "transferred"
      FROM (
        SELECT
          arrayElement(
            arraySort(
              (x) -> tupleElement(x, 1) ,
              groupArray(
                tuple(
                  "version",
                  "address",
                  "unlocked",
                  "transferred"
                )
              )
            ),
            -1
          ) AS "entry"
        FROM "slow_wallet"
        GROUP BY "address"
      )
    `;

    const resultSet = await this.clickhouseService.client.query({
      query,
      format: "JSONEachRow",
    });
    const rows = await resultSet.json<
      {
        address: string;
        unlocked: number;
        transferred: number;
      }[]
    >();

    return rows;
  }

  private async getTotalSupply(): Promise<number> {
    try {
      const resultSet = await this.clickhouseService.client.query({
        query: `
          SELECT
            "amount" / 1e6 AS "totalSupply"
          FROM "total_supply"
          ORDER BY
            "version" DESC,
            "change_index"
          DESC limit 1
        `,
        format: "JSONEachRow",
      });
      const rows = await resultSet.json<
        {
          totalSupply: number;
        }[]
      >();
      if (!rows.length) {
        return 0;
      }
      return rows[0].totalSupply;
    } catch (error) {
      console.error('Error in getTotalSupply:', error);
      throw error; // Rethrow the error after logging
    }
  }


  private async getBurnsOverTime(): Promise<{ timestamp: number; value: number }[]> {
    try {
      const query = `
        SELECT
          toInt32(divide("timestamp", 1000000)) AS "timestamp", // Convert to Unix timestamp
          divide("lifetime_burned", 1000000) AS "value" // Divide by 1e6
        FROM "burn_counter"
        ORDER BY "timestamp"
      `;

      const resultSet = await this.clickhouseService.client.query({
        query: query,
        format: "JSONEachRow",
      });

      const rows = await resultSet.json<
        {
          timestamp: number;
          value: number;
        }[]
      >();

      if (!rows.length) {
        return [];
      }

      return rows.map(row => ({
        timestamp: row.timestamp,
        value: row.value,
      }));
    } catch (error) {
      console.error('Error in getBurnsOverTime:', error);
      throw error;
    }
  }

  private async getSlowWalletsOverTime(): Promise<{ timestamp: number; value: number; }[]> {
    try {
      const resultSet = await this.clickhouseService.client.query({
        query: `
              SELECT
                "timestamp",
                "list_count" AS "value"
              FROM "slow_wallet_list"
              ORDER BY "timestamp" ASC
            `,
        format: "JSONEachRow",
      });
      const rows = await resultSet.json<{
        timestamp: string;
        value: string;
      }[]>();

      if (!rows.length) {
        console.warn('No data found for slow wallets over time.');
        return [];
      }

      // Convert to desired structure with number conversion
      const slowWalletsOverTime = rows.map(row => ({
        timestamp: parseInt(row.timestamp, 10) / 1_000_000,
        value: parseInt(row.value, 10),
      }));

      const result = slowWalletsOverTime.map(item => ({
        timestamp: Math.round(item.timestamp),
        value: item.value,
      }));

      return result;

    } catch (error) {
      console.error('Error in getSlowWalletsOverTime:', error);
      throw error;
    }
  }

  private async getAccountsOnChainOverTime(): Promise<TimestampValue[]> {
    try {
      const query = `
        SELECT 
          toInt32(divide(min(timestamp), 1000000)) AS timestamp,
          address
        FROM coin_balance
        WHERE coin_module = 'libra_coin'
        GROUP BY address
        ORDER BY timestamp ASC
      `;
  
      const resultSet = await this.clickhouseService.client.query({
        query: query,
        format: "JSONEachRow",
      });
  
      const rows = await resultSet.json<{
        timestamp: number;
        address: string;
      }[]>();
  
      // Initialize the result array and a count for accounts with timestamp > 0 (6.9 genesis timestamp is 0)
      const accountsOverTime: TimestampValue[] = [];
      let countOfZeroTimestamps = 0;
      let cumulativeCount = 0;
  
      rows.forEach(row => {
        if (row.timestamp == 0) {
          countOfZeroTimestamps++;
        } else {
          // This is the first record after all the 0 timestamps have been counted
          if (accountsOverTime.length === 0 && countOfZeroTimestamps > 0) {
            accountsOverTime.push({ timestamp: 0, value: countOfZeroTimestamps });
            cumulativeCount = countOfZeroTimestamps;
          }
          cumulativeCount++; // Increment for each unique address with timestamp > 0
          accountsOverTime.push({ timestamp: row.timestamp, value: cumulativeCount });
        }
      });
  
      return accountsOverTime;
    } catch (error) {
      console.error('Error in getAccountsOnChainOverTime:', error);
      throw error;
    }
  }
  
  

}
