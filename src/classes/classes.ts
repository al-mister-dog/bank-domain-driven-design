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

  getAccount(id: string, category: CategoryKey, instrument: InstrumentKey) {
    let account = this[category][instrument].find(
      (acc: Account) => acc.id === id
    );
    return account ? true : false;
  }

  getAccountIndex(
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
    const index = this.getAccountIndex(id, category, instrument);
    this[category][instrument][index].amount = amount;
  }

  increaseBalance(id: string, amount: number, creditInstrument: InstrumentKey) {
    const index = this.getAccountIndex(id, "balances", creditInstrument);
    this.balances[creditInstrument][index].amount += amount;
  }
  decreaseBalance(id: string, amount: number, creditInstrument: InstrumentKey) {
    const index = this.getAccountIndex(id, "balances", creditInstrument);
    this.balances[creditInstrument][index].amount -= amount;
  }
  increaseReserves(amount: number) {
    this.reserves += amount;
  }
  decreaseReserves(amount: number) {
    this.reserves -= amount;
  }

  increaseDues(id: string, category: CategoryKey, amount: number) {
    if (!this.getAccount(id, category, "dues")) {
      this.createInstrumentAccount(id, category, "dues", amount);
    } else {
      const index = this.getAccountIndex(id, category, "dues");
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
    const index = b.getAccountIndex(a.id, "balances", creditInstrument);
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

  static clearCorrespondingDues(a: Bank, b: Bank) {
    a.setAccount(b.id, "assets", "dues", 0);
    a.setAccount(b.id, "liabilities", "dues", 0);
    b.setAccount(a.id, "assets", "dues", 0);
    b.setAccount(a.id, "liabilities", "dues", 0);
  }
  static clearSubordinateDues(a: Bank, b: Bank) {
    a.setAccount(b.id, "assets", "dues", 0);
    b.setAccount(a.id, "liabilities", "dues", 0);
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

  static createSubordinateAccount(
    a: Bank,
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
    this.createSubordinateAccount(a, b, amount, creditInstrument, debtInstrument)
    this.createSubordinateAccount(b, a, amount, creditInstrument, debtInstrument)
    // this.createAccount(a, b, amount, creditInstrument, debtInstrument);
    // b.createInstrumentAccount(a.id, "balances", creditInstrument, amount);
    //YOU ARE HERE
    // this.createAccount(b, a, amount, creditInstrument, debtInstrument);
    // a.createInstrumentAccount(b.id, "balances", creditInstrument, amount);
    
  }

  hasReserves(amount: number): boolean {
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
  static creditAccount(a: Bank, b: Bank, amount: number) {
    b.increaseBalance(a.id, amount, "bankDeposits");
    Bank.mapBalance(a, b, "bankDeposits", "bankOverdrafts");
  }
  static debitAccount(a: Bank, b: Bank, amount: number) {
    b.decreaseBalance(a.id, amount, "bankDeposits");
    Bank.mapBalance(a, b, "bankDeposits", "bankOverdrafts");
  }
  totalAccounts() {
    const totalDueFroms = this.assets.dues.reduce(
      (a, b) => {
        return { amount: a.amount + b.amount };
      },
      { amount: 0 }
    );

    const totalDueTos = this.liabilities.dues.reduce(
      (a, b) => {
        return { amount: a.amount + b.amount };
      },
      { amount: 0 }
    );

    if (ch) {
      if (totalDueTos.amount > totalDueFroms.amount) {
        const total = totalDueTos.amount - totalDueFroms.amount;
        ch.increaseDues(this.id, "assets", total);
        this.increaseDues(ch.id, "liabilities", total);
        this.liabilities.dues = this.liabilities.dues.filter(
          (due) => due.id === ch?.id
        );
        this.assets.dues = [{ id: ch.id, amount: 0 }];
      } else if (totalDueFroms.amount > totalDueTos.amount) {
        const total = totalDueFroms.amount - totalDueTos.amount;
        ch.increaseDues(this.id, "liabilities", total);
        this.increaseDues(ch.id, "assets", total);
        this.assets.dues = this.assets.dues.filter((due) => due.id === ch?.id);
        this.liabilities.dues = [{ id: ch.id, amount: 0 }];
      }
      // this.netAccounts(ch)
    }
    return { totalDueFroms, totalDueTos };
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
      CommercialBank.creditAccount(a, b, aIsLiable.amount);
    } else if (bIsLiable) {
      CommercialBank.creditAccount(b, a, bIsLiable.amount);
    }
    this.clearCorrespondingDues(a, b);
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
      return;
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

  private static creditAccount(a: Customer, b: CommercialBank, amount: number) {
    a.decreaseReserves(amount);
    b.increaseReserves(amount);
    b.increaseBalance(a.id, amount, "customerDeposits");
    Bank.mapBalance(a, b, "customerDeposits", "customerOverdrafts");
  }
  private static debitAccount(a: Customer, b: CommercialBank, amount: number) {
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
let members: Bank[] = [];
let ch: Bank | undefined;
export class ClearingHouse {
  static create(banks: Bank[], clearingHouse: Bank) {
    ch = clearingHouse;
    members = [...members, ...banks];
    banks.forEach((bank) => {
      Bank.createSubordinateAccount(
        bank,
        clearingHouse,
        10000,
        "chCertificates",
        "chOverdrafts"
      );
    });
  }
  static transfer(bank: Bank, clearingHouse: Bank) {
    const bankIsLiable = bank.liabilities.dues.find(
      (due) => due.id === clearingHouse.id && due.amount > 0
    );
    const clearingHouseIsLiable = bank.assets.dues.find(
      (due) => due.id === clearingHouse.id && due.amount > 0
    );
    if (bankIsLiable) {
      clearingHouse.decreaseBalance(bank.id, bankIsLiable.amount, "chCertificates");
      Bank.mapBalance(bank, clearingHouse, "chCertificates", "chOverdrafts");
      Bank.clearSubordinateDues(clearingHouse, bank)
    } else if (clearingHouseIsLiable) {
      clearingHouse.increaseBalance(bank.id, clearingHouseIsLiable.amount, "chCertificates");
      Bank.mapBalance(bank, clearingHouse, "chCertificates", "chOverdrafts");
      Bank.clearSubordinateDues(bank, clearingHouse)
    }
  }

  static totalAccounts(bank: Bank, clearingHouse: Bank) {
    const isMember = members.find(m => m.id = bank.id)
    if (isMember) {
      const totalDueFroms = bank.assets.dues.reduce(
        (a, b) => {
          return { amount: a.amount + b.amount };
        },
        { amount: 0 }
      );
  
      const totalDueTos = bank.liabilities.dues.reduce(
        (a, b) => {
          return { amount: a.amount + b.amount };
        },
        { amount: 0 }
      );
  
      if (ch) {
        if (totalDueTos.amount > totalDueFroms.amount) {
          const total = totalDueTos.amount - totalDueFroms.amount;
          clearingHouse.increaseDues(bank.id, "assets", total);
          bank.increaseDues(clearingHouse.id, "liabilities", total);
          bank.liabilities.dues = bank.liabilities.dues.filter(
            (due) => due.id === clearingHouse?.id
          );
          bank.assets.dues = [{ id: clearingHouse.id, amount: 0 }];
        } else if (totalDueFroms.amount > totalDueTos.amount) {
          const total = totalDueFroms.amount - totalDueTos.amount;
          clearingHouse.increaseDues(bank.id, "liabilities", total);
          bank.increaseDues(clearingHouse.id, "assets", total);
          bank.assets.dues = bank.assets.dues.filter((due) => due.id === clearingHouse?.id);
          bank.liabilities.dues = [{ id: clearingHouse.id, amount: 0 }];
        }
        return { totalDueFroms, totalDueTos };
      } 
      
    } else {
      const totalDueFroms = bank.assets.dues.reduce(
        (a, b) => {
          return { amount: a.amount + b.amount };
        },
        { amount: 0 }
      );
  
      const totalDueTos = bank.liabilities.dues.reduce(
        (a, b) => {
          return { amount: a.amount + b.amount };
        },
        { amount: 0 }
      );
      return { totalDueFroms, totalDueTos };
    }
    
  }
  static totalTransfer() {}
  static get() {
    return ch;
  }
}
