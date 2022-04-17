import { Account, Category, CategoryKey, InstrumentKey, IBank } from "./types";

export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public reserves: number
  ) {}
  createAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number = 0
  ) {
    this[category][instrument] = [
      ...this[category][instrument],
      { id, amount },
    ];
  }
  findAccount(id: string, category: CategoryKey, instrument: InstrumentKey) {
    let account = this[category][instrument].find(
      (acc: Account) => acc.id === id
    );
    return account ? true : false;
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

  addToAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount += amount;
  }
  minusFromAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount -= amount;
  }

  static transferDeposit(
    b1: Bank,
    b2: Bank,
    amount: number,
    instrument: InstrumentKey,
    credit: boolean
  ) {
    Bank.handleTransfer(b1, b2, "assets", instrument, amount, credit);
    Bank.handleTransfer(b2, b1, "liabilities", instrument, amount, credit);
  }
  static handleTransfer(
    b1: Bank,
    b2: Bank,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number,
    credit: boolean
  ) {
    if (!b1.findAccount(b2.id, category, instrument)) {
      b1.createAccount(b2.id, category, instrument);
    }
    if (credit) {
      b1.addToAccount(b2.id, category, instrument, amount);
    } else {
      b1.minusFromAccount(b2.id, category, instrument, amount);
    }
  }


}

export class CommercialBank extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, reserves);
  }
}

export class CorrespondentBank extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, reserves);
  }
  static creditAccount(
    b1: Bank,
    b2: Bank,
    amount: number,
    instrument: InstrumentKey
  ) {
    Bank.transferDeposit(b1, b2, amount, instrument, true);
  }
  static debitAccount(
    b1: Bank,
    b2: Bank,
    amount: number,
    instrument: InstrumentKey
  ) {
    Bank.transferDeposit(b2, b1, amount, instrument, false);
  }
  static createCorrespondingAccounts(
    b1: Bank,
    b2: Bank,
    amount: number,
    instrument: InstrumentKey
  ) {
    b1.createAccount(b2.id, "assets", instrument, amount);
    b1.createAccount(b2.id, "liabilities", instrument, amount);
    b2.createAccount(b1.id, "assets", instrument, amount);
    b2.createAccount(b1.id, "liabilities", instrument, amount);
  }
}
