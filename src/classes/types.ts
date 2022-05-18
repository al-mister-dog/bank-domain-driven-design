import { Bank, Customer } from "./instances";

export type Account = {
  id: string;
  type: string;
  amount: number;
} 

export interface Bill {
  id: string;
  dueTo: string;
  dueFrom: string;
  city: string;
  amount: number;
}

export type Instrument = Account[];

export interface Category {
  [key: string]: Instrument;
}

export interface CategoryTypes {
  assets: Instrument;
  liabilities: Instrument;
  balances: object[];
}

export interface InstrumentTypes {
  bankDeposits: Account[];
  bankOverdrafts: Account[];
  bankLoans: Account[];
  customerOverdrafts: Account[];
  customerDeposits: Account[];
  dues: Account[];
  chCertificates: Account[];
  chOverdrafts: Account[];
  customerLoans: Account[];
  billsOfExchange: Bill[];
}
export interface IBank {
  id: string;
  assets: Category;
  liabilities: Category;
  balances: Category;
  reserves: number;
}
export type CategoryKey = keyof CategoryTypes;
export type InstrumentKey = keyof InstrumentTypes;

export interface IBankLookup {
  [key: string]: Bank;
}
export interface ICustomerLookup {
  [key: string]: Customer;
}
export interface IRecord {
  id: string,
  accountId: string,
  accountType: InstrumentKey,
  transactionAmount: number,
  balance: number,
  credit: boolean,
}

export type Currency = "ecus" | "sterling" | "marc" | "lyonaise"