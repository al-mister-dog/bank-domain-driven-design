import { Bank, Customer } from "./instances";

export interface Account {
  id: string;
  type: string;
  amount: number;
}
export interface Category {
  [key: string]: Instrument;
}
export type Instrument = Account[];
export interface CategoryTypes {
  assets: Instrument;
  liabilities: Instrument;
  accounts: object[];
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
}
export interface IBank {
  id: string;
  assets: Category;
  liabilities: Category;
}
export type CategoryKey = keyof CategoryTypes;
export type InstrumentKey = keyof InstrumentTypes;
export interface IBankLookup {
  [key: string]: Bank;
}
export interface ICustomerLookup {
  [key: string]: Customer;
}
