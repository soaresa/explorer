import { Inject, Injectable } from "@nestjs/common";
import { Stats, TimestampValue, NameValue } from "./types.js";
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
    
    // const slowWalletsCountOverTime = await this.getSlowWalletsCountOverTime(); // DONE
    // const burnsOverTime = await this.getBurnsOverTime(); // DONE
    // const accountsOnChainOverTime = await this.getAccountsOnChainOverTime(); // DONE
    // const supplyAndCapital = await this.getSupplyAndCapital(); // DONE

    // const liquidityConcentrationLiquid = await this.getLiquidityConcentrationLiquid()
    // console.log('liquidityConcentrationLiquid:', liquidityConcentrationLiquid);


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
          AND
            "coin_module" = 'libra_coin'
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

  // Calculates the libra balances of all accounts
  private async getTotalLibraBalances(): Promise<number> {
    try {
      const query = `
        SELECT
            SUM(latest_balance) / 1e6 AS total_balance
        FROM (
            SELECT 
                argMax(balance, version) AS latest_balance
            FROM coin_balance
            WHERE coin_module = 'libra_coin'
            GROUP BY address
        )
      `;
  
      const resultSet = await this.clickhouseService.client.query({
        query: query,
        format: "JSONEachRow",
      });
  
      const result = await resultSet.json<{ total_balance: number }[]>();
  
      // Assuming there's only one row returned
      if (result.length > 0) {
        return result[0].total_balance;
      }
      return 0;
    } catch (error) {
      console.error('Error in getTotalBalances:', error);
      throw error;
    }
  }

  private async getCommunityWalletsBalance(): Promise<number> {
    const communityWallets = await this.olService.getCommunityWallets();
    console.log('communityWallets size:', communityWallets.length)
    const communityWalletsRecords = await this.getWalletsBalances(communityWallets);
    const communityWalletsBalances = communityWalletsRecords.reduce((acc, row) => acc + row.balance, 0);
    return communityWalletsBalances;
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

  private async getSlowWalletsLockedAmount(): Promise<number> {
    try {
      const query = `
      SELECT
        hex(SW.address) AS address,
       (latest_balance - max(SW.unlocked)) / 1e6 AS locked_balance
      FROM
        slow_wallet SW
      JOIN
        (SELECT 
          address, 
          argMax(balance, timestamp) as latest_balance
        FROM coin_balance
        WHERE coin_module = 'libra_coin'
        GROUP BY address) AS CB
      ON SW.address = CB.address
      GROUP BY SW.address, latest_balance
      `;
  
      const resultSet = await this.clickhouseService.client.query({
        query: query,
        format: "JSONEachRow",
      });
  
      const rows = await resultSet.json<{ locked_balance: number }[]>();
  
      // Sum the locked balances
      const totalLockedAmount = rows.reduce((acc, row) => acc + row.locked_balance, 0);
  
      return totalLockedAmount;
    } catch (error) {
      console.error('Error in getSlowWalletsLockedAmount:', error);
      throw error;
    }
  }

  private async getSlowWalletsCountOverTime(): Promise<TimestampValue[]> {
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
  
  private async getSupplyAndCapital(): Promise<{ supplyAllocation: any[], individualsCapital: any[], communityCapital: any[] }> {
    try {
      // Call the provided helper methods
      const totalSupply = await this.getTotalSupply();
      const totalSlowWalletLocked = await this.getSlowWalletsLockedAmount();
      const communityWalletsBalances = await this.getCommunityWalletsBalance();
      const totalLibraBalances = await this.getTotalLibraBalances();
  
      // Calculate additional values
      const infraEscrowBalance = totalSupply - totalLibraBalances;
      const circulating = totalLibraBalances - (totalSlowWalletLocked + communityWalletsBalances);
  
      // Organize the results into the specified structure
      const supplyAllocation = [
        { name: "Community Wallets", value: communityWalletsBalances },
        { name: "Locked", value: totalSlowWalletLocked },
        { name: "Infrastructure escrow", value: infraEscrowBalance },
        { name: "Circulating", value: circulating },
      ];
  
      const individualsCapital = [
        { name: "Locked", value: totalSlowWalletLocked },
        { name: "Circulating", value: circulating },
      ];
  
      const communityCapital = [
        { name: "Community Wallets", value: communityWalletsBalances },
        { name: "Infrastructure escrow", value: infraEscrowBalance },
      ];
  
      return {
        supplyAllocation,
        individualsCapital,
        communityCapital,
      };
    } catch (error) {
      console.error('Error in getSupplyAndCapital:', error);
      throw error;
    }
  }

  private async getLiquidityConcentrationLiquid(): Promise<NameValue[]> {
    try {
      // Fetch community wallet addresses
      const communityWallets = await this.olService.getCommunityWallets();
      const formattedCommunityWallets = communityWallets
        .map(address => `reinterpretAsUInt256('${address}')`)
        .join(', ');

      // Dynamically build the part of the query that excludes community wallets
      const exclusionPart = communityWallets.length > 0 ? `AND address NOT IN (${formattedCommunityWallets})` : '';

        
      const queryForRanges = `
        SELECT 
          CASE
            WHEN balance <= 250 THEN '0 - 250'
            WHEN balance <= 500 THEN '251 - 500'
            WHEN balance <= 2500 THEN '501 - 2,500'
            WHEN balance <= 5000 THEN '2,501 - 5,000'
            WHEN balance <= 25000 THEN '5,001 - 25,000'
            WHEN balance <= 50000 THEN '25,001 - 50,000'
            WHEN balance <= 250000 THEN '50,001 - 250,000'
            WHEN balance <= 500000 THEN '250,001 - 500,000'
            WHEN balance <= 2500000 THEN '500,001 - 2,500,000'
            WHEN balance <= 5000000 THEN '2,500,001 - 5,000,000'
            WHEN balance <= 25000000 THEN '5,000,001 - 25,000,000'
            ELSE '25,000,001 and above'
            END as range,
          count(*) as count
          FROM (
            SELECT 
              address, 
              (balance - IF(sw.unlocked IS NOT NULL, sw.unlocked, 0)) / 1e6 as balance
            FROM coin_balance cb
            LEFT JOIN (
              SELECT 
                address, 
                SUM(unlocked) as unlocked
              FROM slow_wallet
              GROUP BY address
            ) sw ON cb.address = sw.address
            WHERE 1 = 1 
            ${exclusionPart}
          ) AS balance_adjusted
          GROUP BY range`;

      // Execute the query
      const resultSet = await this.clickhouseService.client.query({
        query: queryForRanges,
        format: "JSONEachRow",
      });

      // Parse the results
      const results = await resultSet.json() as NameValue[];

      return results;
    } catch (error) {
      console.error('Error in getLiquidityConcentrationLiquid:', error);
      throw error;
    }
  }

}
