import { Field, ObjectType } from "@nestjs/graphql";
import BN from "bn.js";

interface GqlValidatorGradeInput {
  compliant: boolean;
  proposedBlocks: number;
  failedBlocks: number;
}

@ObjectType("ValidatorGrade")
export class GqlValidatorGrade {
  public constructor(input: GqlValidatorGradeInput) {
    this.compliant = input.compliant;
    this.proposedBlocks = input.proposedBlocks;
    this.failedBlocks = input.failedBlocks;
  }

  @Field(() => Boolean)
  public compliant: boolean;

  @Field(() => Number)
  public proposedBlocks: number;

  @Field(() => Number)
  public failedBlocks: number;
}

interface GqlValidatorInput {
  address: Buffer;
  votingPower: BN;
  grade: GqlValidatorGradeInput;
  inSet: boolean;
  index: BN;
  networkAddresses?: string;
  fullnodeAddresses?: string;
  city?: string;
  country?: string;
}

@ObjectType("Validator")
export class GqlValidator {
  public constructor(input: GqlValidatorInput) {
    this.address = input.address;
    this.votingPower = input.votingPower;
    this.grade = input.grade;
    this.inSet = input.inSet;
    this.index = input.index;
    this.networkAddresses = input.networkAddresses;
    this.fullnodeAddresses = input.fullnodeAddresses;
    this.city = input.city;
    this.country = input.country;
  }

  @Field(() => Boolean)
  public inSet: boolean;

  @Field(() => BN)
  public index: BN;

  @Field(() => Buffer)
  public address: Buffer;

  @Field(() => String, { nullable: true })
  public networkAddresses?: string;

  @Field(() => String, { nullable: true })
  public fullnodeAddresses?: string;

  @Field(() => String, { nullable: true })
  public city?: string;

  @Field(() => String, { nullable: true })
  public country?: string;

  @Field(() => BN)
  public votingPower: BN;

  @Field(() => BN)
  public failedProposals: BN;

  @Field(() => BN)
  public successfulProposals: BN;

  @Field(() => GqlValidatorGrade, { nullable: true })
  public grade?: GqlValidatorGrade;
}

interface GqlVouchInput {
  epoch: BN;
  address: Buffer;
  inSet: boolean;
}

@ObjectType("Vouch")
export class GqlVouch {
  public constructor(input: GqlVouchInput) {
    this.epoch = input.epoch;
    this.address = input.address;
    this.inSet = input.inSet;
  }

  @Field(() => BN)
  public epoch: BN;

  @Field(() => Buffer)
  public address: Buffer;

  @Field(() => Boolean)
  public inSet: boolean;
}

interface GqlValidatorCurrentBidInput {
  currentBid: number;
  expirationEpoch: number;
}

@ObjectType("ValidatorCurrentBid")
export class GqlValidatorCurrentBid {
  public constructor(input: GqlValidatorCurrentBidInput) {
    this.currentBid = input.currentBid;
    this.expirationEpoch = input.expirationEpoch;
  }

  @Field(() => Number)
  public currentBid: number;

  @Field(() => Number)
  public expirationEpoch: number;
}
