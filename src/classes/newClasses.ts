import { Account, Category, CategoryKey, InstrumentKey, IBank } from "./types";

export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category
  ) {}

  createInstrumentAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number = 0
  ) {
    if (!this[category][instrument]) {
      return;
    }
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

  setAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount = amount;
  }

  increaseBalance(id: string, amount: number, creditInstrument: InstrumentKey) {
    const index = this.findAccountIndex(id, "balances", creditInstrument);
    this.balances[creditInstrument][index].amount += amount;
  }
  decreaseBalance(id: string, amount: number, creditInstrument: InstrumentKey) {
    const index = this.findAccountIndex(id, "balances", creditInstrument);
    this.balances[creditInstrument][index].amount -= amount;
  }

  static mapBalance(a: Bank, b: Bank, creditInstrument: InstrumentKey, debtInstrument: InstrumentKey) {
    const index = b.findAccountIndex(a.id, "balances", creditInstrument);
    const balance = b.balances[creditInstrument][index].amount;
    if (balance > 0) {
      a.setAccount(b.id, "assets", creditInstrument, balance);
      b.setAccount(a.id, "liabilities", creditInstrument, balance);
      a.setAccount(b.id, "liabilities", debtInstrument, 0);
      b.setAccount(a.id, "assets", debtInstrument, 0);
    } else if (balance < 0) {
      a.setAccount(b.id, "liabilities", debtInstrument, -balance);
      b.setAccount(a.id, "assets", debtInstrument, -balance);
      a.setAccount(b.id, "assets", creditInstrument, 0);
      b.setAccount(a.id, "liabilities", creditInstrument, 0);
    } else if (balance === 0) {
      a.setAccount(b.id, "liabilities", debtInstrument, 0);
      b.setAccount(a.id, "assets", debtInstrument, 0);
      a.setAccount(b.id, "assets", creditInstrument, 0);
      b.setAccount(a.id, "liabilities", creditInstrument, 0);
    }
  }

  static createCorrespondingAccounts(
    a: Bank,//CorrespondentBank
    b: Bank,//CorrespondentBank
    amount: number,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
    a.createInstrumentAccount(b.id, "assets", creditInstrument, amount);
    a.createInstrumentAccount(b.id, "liabilities", creditInstrument, amount);
    a.createInstrumentAccount(b.id, "assets", debtInstrument, 0);
    a.createInstrumentAccount(b.id, "liabilities", debtInstrument, 0);

    b.createInstrumentAccount(a.id, "assets", creditInstrument, amount);
    b.createInstrumentAccount(a.id, "liabilities", creditInstrument, amount);
    b.createInstrumentAccount(a.id, "assets", debtInstrument, 0);
    b.createInstrumentAccount(a.id, "liabilities", debtInstrument, 0);

    a.createInstrumentAccount(b.id, "balances", creditInstrument, amount);
    b.createInstrumentAccount(a.id, "balances", creditInstrument, amount);
  }

  static createCustomerAccount(
    a: Customer,
    b: Bank,
    amount: number,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
    a.createInstrumentAccount(b.id, "assets", creditInstrument, amount);
    a.createInstrumentAccount(b.id, "liabilities", debtInstrument, 0);
    b.createInstrumentAccount(a.id, "liabilities", creditInstrument, amount);
    b.createInstrumentAccount(a.id, "assets", debtInstrument, 0);
    b.createInstrumentAccount(a.id, "balances", creditInstrument, amount);
  }
}

export class CommercialBank extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, balances);
  }
  deposit(amount: number) {
    this.reserves += amount;
  }
  withdraw(amount: number) {
    this.reserves -= amount;
  }
}

export class CorrespondentBank extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, balances);
  }
  static creditAccount(a: Bank, b: Bank, amount: number) {
    b.increaseBalance(a.id, amount, "bankDeposits");
    Bank.mapBalance(a, b, "bankDeposits", "bankOverdrafts");
  }
  static debitAccount(a: Bank, b: Bank, amount: number) {
    b.decreaseBalance(a.id, amount, "bankDeposits");
    Bank.mapBalance(a, b, "bankDeposits", "bankOverdrafts");
  }
}

export class Customer extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, balances);
  }
  deposit(amount: number) {
    this.reserves -= amount;
  }
  withdraw(amount: number) {
    this.reserves += amount;
  }

  static makeDeposit(a: Customer, b: CommercialBank, amount: number) {
    b.increaseBalance(a.id, amount, "customerDeposits");
    Bank.mapBalance(a, b, "customerDeposits", "customerOverdrafts");
  }
  static makeWithdrawal(a: Customer, b: CommercialBank, amount: number) {
    b.decreaseBalance(a.id, amount, "customerDeposits");
    Bank.mapBalance(a, b, "customerDeposits", "customerOverdrafts");
  }
}

//TODO: MAKE THE NEGATIVE FUNCTION DYNAMIC
