import {
  commercialAssets,
  commercialLiabilities,
  clearinghouseAssets,
  clearinghouseLiabilities,
  customerLiabilities,
  customerAssets,
} from "./fixtures";

import {
  IBank,
  Category,
  CategoryKey,
  InstrumentKey,
  Account,
  IBankLookup,
  ICustomerLookup,
} from "./types";

export const bankLookup: IBankLookup = {};
export const customerLookup: ICustomerLookup = {};

export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
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

  increaseInstrument(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    if (!this.isAccount(id, category, instrument)) {
      this.createInstrumentAccount(id, category, instrument, amount);
    } else {
      const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount += amount;
    }
  }

  decreaseInstrument(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount -= amount;
  }

  increaseReserves(amount: number) {
    this.reserves += amount
  }

  decreaseReserves(amount: number) {
    this.reserves -= amount
  }

}

export class CommercialBank extends Bank {
  constructor(
    public id: string,
    public assets: Category = { ...commercialAssets },
    public liabilities: Category = { ...commercialLiabilities },
    public accounts: any[] = [],
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, accounts, reserves);
    bankLookup[id] = this;
  }
}

export class Customer extends Bank {
  constructor(
    public id: string,
    public assets: Category = { ...customerAssets },
    public liabilities: Category = {
      ...customerLiabilities
    },
    public accounts: any[] = [],
    public reserves: number = 100
  ) {
    super(id, assets, liabilities, accounts, reserves);
    customerLookup[id] = this;
  }
}

export class ClearingHouse extends Bank {
  constructor(
    public id: string = "clearinghouse",
    public assets: Category = { ...clearinghouseAssets },
    public liabilities: Category = { ...clearinghouseLiabilities },
    public accounts: any[] = [],
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, accounts, reserves);
    bankLookup[id] = this;
  }
}
