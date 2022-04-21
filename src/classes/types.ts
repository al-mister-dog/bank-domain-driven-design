export interface Account {
  id: string;
  amount: number;
}

export interface Category {
  [key: string]: Instrument;
}

export type Instrument = Account[];

export interface CategoryTypes {
  assets: Instrument;
  liabilities: Instrument;
  balances: Instrument;
}

export interface InstrumentTypes {
  bankDeposits: Account[];
  bankOverdrafts: Account[];
  bankLoans: Account[];
  customerOverdrafts: Account[];
  customerDeposits: Account[];
}

export interface IBank {
  id: string;
  assets: Category;
  liabilities: Category;
  // reserves: number;
}

export type CategoryKey = keyof CategoryTypes;
export type InstrumentKey = keyof InstrumentTypes;
