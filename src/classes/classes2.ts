import { Account, Category, CategoryKey, InstrumentKey, IBank } from "./types";

export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category
  ) {}
  createAccount(
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
  createAccountTest(
    b1: Bank,
    b2: Bank,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number = 0
  ) {
    let accountId = `${b1.id}>${b2.id}`;
    if (!this[category][instrument]) {
      return;
    }
    this[category][instrument] = [
      ...this[category][instrument],
      { id: accountId, amount },
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

  mapBalance(
    b1: Bank,
    categories: CategoryKey[],
    instruments: InstrumentKey[]
  ) {
    const creditAccount = instruments[0]
    const overdraft = instruments[1]
    const index1 = this.findAccountIndex(b1.id, categories[0], creditAccount);
    const index2 = this.findAccountIndex(b1.id, categories[1], overdraft);
    const balanceIndex = this.findAccountIndex(
      b1.id,
      "balances",
      creditAccount
    );
    const balance = this.balances[creditAccount][balanceIndex].amount;

    if (balance < 0) {
      this[categories[0]][creditAccount][index2].amount = 0;
      this[categories[1]][overdraft][index1].amount = -balance;
    } else if (balance > 0) {
      this[categories[0]][creditAccount][index1].amount = balance;
      this[categories[1]][overdraft][index2].amount = 0;
    } else {
      this[categories[0]][creditAccount][index1].amount = 0;
      this[categories[1]][overdraft][index2].amount = 0;
    }
  }

  mapBalanceTest(
    id: string,
    b1: Bank,
    categories: CategoryKey[],
    instruments: InstrumentKey[]
  ) {
    
    const creditAccount = instruments[0]
    const overdraft = instruments[1]
    const index1 = this.findAccountIndex(b1.id, categories[0], creditAccount);
    const index2 = this.findAccountIndex(b1.id, categories[1], overdraft);
    const balanceIndex = this.findAccountIndex(
      id,
      "balances",
      creditAccount
    );
    const balance = this.balances[creditAccount][balanceIndex].amount;
    if (balance < 0) {
      this[categories[0]][creditAccount][index2].amount = 0;
      this[categories[1]][overdraft][index1].amount = -balance;
    } else if (balance > 0) {
      this[categories[0]][creditAccount][index1].amount = balance;
      this[categories[1]][overdraft][index2].amount = 0;
    } else {
      this[categories[0]][creditAccount][index1].amount = 0;
      this[categories[1]][overdraft][index2].amount = 0;
    }
  }

  static createCorrespondingAccounts(
    b1: Bank,
    b2: Bank,
    amount: number,
    instrument1: InstrumentKey,
    instrument2: InstrumentKey
  ) {
    b1.createAccount(b2.id, "balances", instrument1, amount);
    b1.createAccount(b2.id, "assets", instrument1, amount);
    b1.createAccount(b2.id, "assets", instrument2, amount);
    b1.createAccount(b2.id, "liabilities", instrument1, amount);
    b1.createAccount(b2.id, "liabilities", instrument2, amount);

    b2.createAccount(b1.id, "balances", instrument1, amount);
    b2.createAccount(b1.id, "assets", instrument1, amount);
    b2.createAccount(b1.id, "assets", instrument2, amount);
    b2.createAccount(b1.id, "liabilities", instrument1, amount);
    b2.createAccount(b1.id, "liabilities", instrument2, amount);
  }

    static createCorrespondingAccountsTest(
    a: CorrespondentBank,
    b: CorrespondentBank,
    amount: number
  ) {
    a.createAccount(b.id, "assets", "bankDeposits", amount);
    a.createAccount(b.id, "liabilities", "bankDeposits", amount);
    a.createAccount(b.id, "assets", "bankOverdrafts", 0);
    a.createAccount(b.id, "liabilities", "bankOverdrafts", 0);
    
    b.createAccount(a.id, "assets", "bankOverdrafts", 0);
    b.createAccount(a.id, "liabilities", "bankOverdrafts", 0);
    b.createAccount(a.id, "assets", "bankDeposits", amount);
    b.createAccount(a.id, "liabilities", "bankDeposits", amount);

    a.createAccountTest(a, b, "balances", "bankDeposits", amount);
    b.createAccountTest(a, b, "balances", "bankDeposits", amount);
    b.createAccountTest(b, a, "balances", "bankDeposits", amount);
    a.createAccountTest(b, a, "balances", "bankDeposits", amount);
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
  static creditAccount(
    a: Bank,
    b: Bank,
    amount: number
    // instrument: InstrumentKey
  ) {
    // Bank.transferDeposit(b1, b2, amount, instrument, true);
    a.addToAccount(b.id, "balances", "bankDeposits", amount);
    b.addToAccount(a.id, "balances", "bankDeposits", amount);
    a.mapBalance(
      b,
      ["assets", "liabilities"],
      ["bankDeposits", "bankOverdrafts"]
    );
    b.mapBalance(
      a,
      ["liabilities", "assets"],
      ["bankDeposits", "bankOverdrafts"]
    );
    // a.deposit(amount);
    // b.deposit(amount);
  }
  static debitAccount(a: Bank, b: Bank, amount: number) {
    a.minusFromAccount(b.id, "balances", "bankDeposits", amount);
    b.minusFromAccount(a.id, "balances", "bankDeposits", amount);
    a.mapBalance(
      b,
      ["liabilities", "assets"],
      ["bankDeposits", "bankOverdrafts"]
    );
    b.mapBalance(
      a,
      ["assets", "liabilities"],
      ["bankDeposits", "bankOverdrafts"]
    );
    
  }
  static creditAccountTest(
    a: Bank,
    b: Bank,
    amount: number
    // instrument: InstrumentKey
  ) {
    const id = `${a.id}>${b.id}`
    a.addToAccount(id, "balances", "bankDeposits", amount);
    b.addToAccount(id, "balances", "bankDeposits", amount);
    a.mapBalanceTest(
      id,
      b,
      ["assets", "liabilities"],
      ["bankDeposits", "bankOverdrafts"]
    );
    b.mapBalanceTest(
      id,
      a,
      ["liabilities", "assets"],
      ["bankDeposits", "bankOverdrafts"]
    );
  }
  static debitAccountTest(a: Bank, b: Bank, amount: number) {
    const id = `${a.id}>${b.id}`
    a.minusFromAccount(id, "balances", "bankDeposits", amount);
    b.minusFromAccount(id, "balances", "bankDeposits", amount);
    a.mapBalanceTest(
      id,
      b,
      ["liabilities", "assets"],
      ["bankDeposits", "bankOverdrafts"]
    );
    b.mapBalanceTest(
      id,
      a,
      ["assets", "liabilities"],
      ["bankDeposits", "bankOverdrafts"]
    );
  }

}

export class Customer extends Bank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public cash: number = 0
  ) {
    super(id, assets, liabilities, balances);
  }
  deposit(amount: number) {
    this.cash -= amount;
  }
  withdraw(amount: number) {
    this.cash += amount;
  }

  static makeDeposit(c1: Customer, b1: CommercialBank, amount: number) {
    c1.addToAccount(b1.id, "balances", "customerDeposits", amount);
    b1.addToAccount(c1.id, "balances", "customerDeposits", amount);
    c1.mapBalance(
      b1,
      ["assets", "liabilities"],
      ["customerDeposits", "customerOverdrafts"]
    );
    b1.mapBalance(
      c1,
      ["liabilities", "assets"],
      ["customerDeposits", "customerOverdrafts"]
    );
    c1.deposit(amount);
    b1.deposit(amount);
  }
  static makeWithdrawal(c1: Customer, b1: CommercialBank, amount: number) {
    c1.minusFromAccount(b1.id, "balances", "customerDeposits", amount);
    b1.minusFromAccount(c1.id, "balances", "customerDeposits", amount);
    c1.mapBalance(
      b1,
      ["assets", "liabilities"],
      ["customerDeposits", "customerOverdrafts"]
    );
    b1.mapBalance(
      c1,
      ["liabilities", "assets"],
      ["customerDeposits", "customerOverdrafts"]
    );
    c1.deposit(amount);
    b1.deposit(amount);
  }
  static createCorrespondingAccounts(
    c: Customer,
    b: CommercialBank,
    amount: number
  ) {
    c.createAccount(b.id, "assets", "customerDeposits", amount);
    c.createAccount(b.id, "liabilities", "customerOverdrafts", amount);
    c.createAccount(b.id, "balances", "customerDeposits", amount);
    b.createAccount(c.id, "assets", "customerOverdrafts", amount);
    b.createAccount(c.id, "liabilities", "customerDeposits", amount);
    b.createAccount(c.id, "balances", "customerDeposits", amount);
  }
}

//TODO: MAKE THE NEGATIVE FUNCTION DYNAMIC
