import { Account, Category, CategoryKey, InstrumentKey, IBank } from "./types";
interface ILookup {
  [key: string]: CommercialBank;
}
const lookupTable: ILookup = {};

export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public reserves: number
  ) {}
  createInstrumentAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number = 0
  ): void {
    // if (!this[category][instrument]) {
    //   return;
    // }
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
  increaseReserves(amount: number) {
    this.reserves += amount;
  }
  decreaseReserves(amount: number) {
    this.reserves -= amount;
  }
  increaseDues(id: string, category: CategoryKey, amount: number) {
    if (!this.findAccount(id, category, "dues")) {
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
  static mapBalance(
    a: Bank,
    b: Bank,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
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

  static netTransfer(a: Bank, b: Bank) {
    a.netAccounts(b);
    b.netAccounts(a);
    const aIsLiable = a.assets.dues.find(
      (due) => due.id === b.id && due.amount > 0
    );
    const bIsLiable = b.assets.dues.find(
      (due) => due.id === a.id && due.amount > 0
    );
    if (aIsLiable) {
      CorrespondentBank.creditAccount(a, b, aIsLiable.amount);
    }
    if (bIsLiable) {
      // CorrespondentBank.creditAccount(b, a, bIsLiable.amount);
      console.log(bIsLiable.amount)
    }
    if (!aIsLiable && !bIsLiable) {
      return;
    }
    // this.clearDues(a, b);
  }
  // static clearDues(a: Bank, b: Bank) {}
  static createCustomerAccount(
    a: Customer,
    b: Bank,
    amount: number,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
    this.createAccount(a, b, amount, creditInstrument, debtInstrument);
    b.createInstrumentAccount(a.id, "balances", creditInstrument, amount);
  }

  static createCorrespondingAccounts(
    a: Bank,
    b: Bank,
    amount: number,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
    this.createAccount(a, b, amount, creditInstrument, debtInstrument);
    this.createAccount(b, a, amount, creditInstrument, debtInstrument);
    a.createInstrumentAccount(b.id, "balances", creditInstrument, amount);
    b.createInstrumentAccount(a.id, "balances", creditInstrument, amount);
  }

  private static createAccount(
    a: Customer,
    b: Bank,
    amount: number,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
    a.createInstrumentAccount(b.id, "assets", creditInstrument, amount);
    a.createInstrumentAccount(b.id, "liabilities", debtInstrument, 0);
    b.createInstrumentAccount(a.id, "assets", debtInstrument, 0);
    b.createInstrumentAccount(a.id, "liabilities", creditInstrument, amount);
  }

  hasReserves(amount: number) {
    return this.reserves - amount < 0 ? false : true;
  }
}

export class CommercialBank extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public reserves: number = 1000
  ) {
    super(id, assets, liabilities, balances, reserves);
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
    public reserves: number = 1000
  ) {
    super(id, assets, liabilities, balances, reserves);
  }
  static creditAccount(a: Bank, b: Bank, amount: number) {
    console.log(a.assets.dues)
    // b.increaseBalance(a.id, amount, "bankDeposits");
    // Bank.mapBalance(a, b, "bankDeposits", "bankOverdrafts");
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
    public reserves: number = 100
  ) {
    super(id, assets, liabilities, balances, reserves);
  }
  static makeDeposit(a: Customer, b: CommercialBank, amount: number) {
    if (!a.hasReserves(amount)) {
      // console.log(`${a.id} has insufficient funds to make deposit`)
    }
    this.creditAccount(a, b, amount);
  }
  static makeWithdrawal(a: Customer, b: CommercialBank, amount: number) {
    if (!b.hasReserves(amount)) {
      // console.log(`${b.id} has insufficient funds to make deposit`)
    }
    this.debitAccount(a, b, amount);
  }

  static creditAccount(a: Customer, b: CommercialBank, amount: number) {
    a.decreaseReserves(amount);
    b.increaseReserves(amount);
    b.increaseBalance(a.id, amount, "customerDeposits");
    Bank.mapBalance(a, b, "customerDeposits", "customerOverdrafts");
  }
  static debitAccount(a: Customer, b: CommercialBank, amount: number) {
    a.increaseReserves(amount);
    b.decreaseReserves(amount);
    b.decreaseBalance(a.id, amount, "customerDeposits");
    Bank.mapBalance(a, b, "customerDeposits", "customerOverdrafts");
  }

  static giveDetails(a: Customer, b: Customer, bank: CommercialBank) {
    lookupTable[`${a.id}${b.id}`] = bank;
  }
  static shareDetails(a: Customer, b: Customer, bank: CommercialBank) {
    lookupTable[`${a.id}${b.id}`] = bank;
    lookupTable[`${b.id}${a.id}`] = bank;
  }
  static transfer(a: Customer, b: Customer, amount: number) {
    const bankA = lookupTable[`${a.id}${b.id}`];
    const bankB = lookupTable[`${b.id}${a.id}`];
    this.debitAccount(a, bankA, amount);
    bankA.increaseDues(bankB.id, "liabilities", amount);
    this.creditAccount(b, bankB, amount);
    bankB.increaseDues(bankA.id, "assets", amount);
  }
  // "transfer" might work for intertransfer
}
