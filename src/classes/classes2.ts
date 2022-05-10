import { bankingSystem, ClearingHouseService, StaticMethods } from "./staticMethods";

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
  balances: Instrument;
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
  // reserves: number;
}
export type CategoryKey = keyof CategoryTypes;
export type InstrumentKey = keyof InstrumentTypes;
interface IBankLookup {
  [key: string]: Bank;
}
interface ICustomerLookup {
  [key: string]: Customer;
}
export const bankLookup: IBankLookup = {};
export const customerLookup: ICustomerLookup = {};
interface ILookup {
  [key: string]: CommercialBank;
}
const lookupTable: ILookup = {};
interface SystemLookup {
  [key: string]: boolean;
}

let clearinghouse;

export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public accounts: any,
    public reserves: number
  ) {}

  setAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount = amount;
  }

  isAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey
  ): boolean {
    let account = this[category][instrument].find(
      (acc: Account) => acc.id === id
    );
    return account ? true : false;
  }

  createInstrumentAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number = 0
  ): void {
    this[category][instrument] = [
      ...this[category][instrument],
      { id, type: instrument, amount },
    ];
  }

  findAccountIndex(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey
  ) {
    const index = this[category][instrument].findIndex((acc: Account) => {
      return acc.id === id;
    });
    return index;
  }

  increaseDues(id: string, category: CategoryKey, amount: number) {
    if (!this.isAccount(id, category, "dues")) {
      this.createInstrumentAccount(id, category, "dues", amount);
    } else {
      const index = this.findAccountIndex(id, category, "dues");
      this[category].dues[index].amount += amount;
    }
  }

  netAccounts(bank: Bank) {
    let dueFrom = this.assets.dues.find((due) => due.id === bank.id);
    let dueTo = this.liabilities.dues.find((due) => due.id === bank.id);
    if (dueFrom === undefined && dueTo === undefined) {
      return;
    }
    if (dueFrom === undefined || dueTo === undefined) {
      return;
    }
    if (dueFrom.amount > dueTo.amount) {
      dueFrom.amount = dueFrom.amount - dueTo.amount;
      dueTo.amount = 0;
    } else if (dueTo.amount > dueFrom.amount) {
      dueTo.amount = dueTo.amount - dueFrom.amount;
      dueFrom.amount = 0;
    } else {
      dueTo.amount = 0;
      dueFrom.amount = 0;
    }
  }
  net() {
    this.assets.dues.forEach((thisDue) => {
      let dueFrom = thisDue;
      let dueTo = this.liabilities.dues.find((due) => (due.id = thisDue.id));
      if (!dueTo) {
        return;
      }
      if (dueFrom.amount > dueTo.amount) {
        dueFrom.amount = dueFrom.amount - dueTo.amount;
        dueTo.amount = 0;
      }
      if (dueTo.amount > dueFrom.amount) {
        dueTo.amount = dueTo.amount - dueFrom.amount;
        dueFrom.amount = 0;
      }
      if (dueTo.amount === dueFrom.amount) {
        dueTo.amount = 0;
        dueFrom.amount = 0;
      }
    });
  }
  netDues() {
    this.net();
    if (bankingSystem.clearinghouse) {
      ClearingHouseService.netDues(this);
    }
  }
}

export class CommercialBank extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public accounts: any[],
    public reserves: number = 1000
  ) {
    super(id, assets, liabilities, balances, accounts, reserves);
    bankLookup[id] = this;
    if (bankingSystem.clearinghouse) {
      ClearingHouseService.openAccount(this, bankLookup["clearinghouse"]);
    }
  }
}

export class Customer extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public accounts: any[],
    public reserves: number = 100
  ) {
    super(id, assets, liabilities, balances, accounts, reserves);
    customerLookup[id] = this;
  }
}

export class ClearingHouse extends Bank {
  constructor(
    public id: string = "clearinghouse",
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public accounts: any[],
    public reserves: number = 100
  ) {
    super(id, assets, liabilities, balances, accounts, reserves);
    bankLookup["clearinghouse"] = this;
  }
}
