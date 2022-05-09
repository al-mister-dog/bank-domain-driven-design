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
const bankingSystem: SystemLookup = {
  correspondent: false,
  clearinghouse: false,
  centralbank: false,
};
let clearinghouse;

class ClearingHouseSystem {
  increaseDues(bankA: Bank, bankB: Bank, amount: number) {
    bankA.increaseDues(bankLookup["clearinghouse"].id, "liabilities", amount);
    bankLookup["clearinghouse"].increaseDues(bankA.id, "assets", amount);
    bankB.increaseDues(bankLookup["clearinghouse"].id, "assets", amount);
    bankLookup["clearinghouse"].increaseDues(bankB.id, "liabilities", amount);
  }
}
class CorrespondentSystem {
  increaseDues(bankA: Bank, bankB: Bank, amount: number) {
    bankA.increaseDues(bankB.id, "liabilities", amount);
    bankB.increaseDues(bankA.id, "assets", amount);
  }
}
let systemtype: ClearingHouseSystem | CorrespondentSystem;
export class SystemManager {
  static setSystem(system: string) {
    if (system === "clearinghouse") {
      systemtype = new ClearingHouseSystem();
    }
    if (system === "correspondent") {
      systemtype = new CorrespondentSystem();
    }
  }
}
export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public balances: Category,
    public accounts: any,
    public reserves: number
  ) {}
  static setBankingSystem(type: string) {
    bankingSystem[type] = true;
  }
  static getBankingSystem() {
    return bankingSystem;
  }
  static handleSystem(bankA: Bank, bankB: Bank, amount: number) {
    if (bankingSystem.correspondent) {
      bankA.increaseDues(bankB.id, "liabilities", amount);
      bankB.increaseDues(bankA.id, "assets", amount);
    }
    if (bankingSystem.clearinghouse) {
      bankA.increaseDues(bankLookup["clearinghouse"].id, "liabilities", amount);
      bankLookup["clearinghouse"].increaseDues(bankA.id, "assets", amount);
      bankB.increaseDues(bankLookup["clearinghouse"].id, "assets", amount);
      bankLookup["clearinghouse"].increaseDues(bankB.id, "liabilities", amount);
    }
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
  // getAccount(id: string, category: CategoryKey, instrument: InstrumentKey) {
  //   const account: Account | undefined = this[category][instrument].find(
  //     (acc: Account) => acc.id === id
  //   );
  //   if (!account) {
  //     return { id: "null", amount: 0 };
  //   }
  //   return account;
  // }
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
  ///////////////////////////////////////////////////////////////////////////
  static createAccount(a: Bank, b: Bank, creditInstrument: InstrumentKey) {
    const id = `${a.id}-${b.id}`;

    a.accounts = [...a.accounts, { id, type: creditInstrument, balance: 0 }];
    b.accounts = [...b.accounts, { id, type: creditInstrument, balance: 0 }];
  }

  static createSubordinateAccount(
    a: Bank,
    b: Bank,
    amount: number,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
    a.createInstrumentAccount(b.id, "assets", creditInstrument, amount);
    a.createInstrumentAccount(b.id, "liabilities", debtInstrument, 0);
    b.createInstrumentAccount(a.id, "assets", debtInstrument, 0);
    b.createInstrumentAccount(a.id, "liabilities", creditInstrument, amount);
    // b.createInstrumentAccount(a.id, "balances", creditInstrument, amount);
    this.createAccount(a, b, creditInstrument);
  }

  // static createCorrespondingAccounts(
  //   a: Bank,
  //   b: Bank,
  //   amount: number,
  //   creditInstrument: InstrumentKey,
  //   debtInstrument: InstrumentKey
  // ) {
  //   this.createSubordinateAccount(
  //     a,
  //     b,
  //     amount,
  //     creditInstrument,
  //     debtInstrument
  //   );
  //   this.createSubordinateAccount(
  //     b,
  //     a,
  //     amount,
  //     creditInstrument,
  //     debtInstrument
  //   );
  // }
  static debitAccount(
    a: Bank,
    b: Bank,
    amount: number,
    instruments: InstrumentKey[]
  ) {
    const id = `${a.id}-${b.id}`;
    const aAccount = a.accounts.find((account: any) => account.id === id);
    const bAccount = b.accounts.find((account: any) => account.id === id);
    aAccount.balance -= amount;
    bAccount.balance -= amount;
    const [creditInstrument, debtInstrument] = instruments;
    Bank.mapBalance(a, b, creditInstrument, debtInstrument, aAccount.balance);
  }
  static creditAccount(
    a: Bank,
    b: Bank,
    amount: number,
    instruments: InstrumentKey[]
  ) {
    const id = `${a.id}-${b.id}`;
    const aAccount = a.accounts.find((account: any) => account.id === id);
    const bAccount = b.accounts.find((account: any) => account.id === id);
    aAccount.balance += amount;
    bAccount.balance += amount;
    const [creditInstrument, debtInstrument] = instruments;
    Bank.mapBalance(a, b, creditInstrument, debtInstrument, aAccount.balance);
  }
  // increaseInstrument(
  //   id: string,
  //   category: CategoryKey,
  //   instrument: InstrumentKey,
  //   amount: number
  // ) {
  //   const index = this.findAccountIndex(id, category, instrument);
  //   this[category][instrument][index].amount += amount;
  // }
  // decreaseInstrument(
  //   id: string,
  //   category: CategoryKey,
  //   instrument: InstrumentKey,
  //   amount: number
  // ) {
  //   const index = this.findAccountIndex(id, category, instrument);
  //   this[category][instrument][index].amount -= amount;
  // }
  // increaseBalance(id: string, amount: number, creditInstrument: InstrumentKey) {
  //   const index = this.findAccountIndex(id, "balances", creditInstrument);
  //   this.balances[creditInstrument][index].amount += amount;
  // }
  // decreaseBalance(id: string, amount: number, creditInstrument: InstrumentKey) {
  //   const index = this.findAccountIndex(id, "balances", creditInstrument);
  //   this.balances[creditInstrument][index].amount -= amount;
  // }
  static mapBalance(
    a: Bank,
    b: Bank,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey,
    balance: number
  ) {
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

  // increaseReserves(amount: number) {
  //   this.reserves += amount;
  // }
  // decreaseReserves(amount: number) {
  //   this.reserves -= amount;
  // }

  increaseDues(id: string, category: CategoryKey, amount: number) {
    if (!this.isAccount(id, category, "dues")) {
      this.createInstrumentAccount(id, category, "dues", amount);
    } else {
      const index = this.findAccountIndex(id, category, "dues");
      this[category].dues[index].amount += amount;
    }
  }

  // reduceAccounts(bank: Bank, category: CategoryKey, instrument: InstrumentKey) {
  //   return bank[category][instrument].reduce(
  //     (acc, cur) => {
  //       return { amount: acc.amount + cur.amount };
  //     },
  //     { amount: 0 }
  //   );
  // }
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
      ClearingHouse.netDues(this);
    }
  }
  static newSettleDues() {
    if (bankingSystem.clearinghouse) {
      ClearingHouse.settleDues();
    } else {
      for (const bank in bankLookup) {
        bankLookup[bank].liabilities.dues.forEach((due) => {
          CommercialBank.creditAccount(
            bankLookup[due.id],
            bankLookup[bank],
            due.amount
          );
          this.clearDues(bankLookup[bank], bankLookup[due.id]);
        });
      }
    }
  }
  static settleDues(a: Bank, b: Bank) {
    //do extra checks??

    const aOwesB = a.liabilities.dues.find(
      (due) => due.id === b.id && due.amount > 0
    );
    const bOwesA = b.liabilities.dues.find(
      (due) => due.id === a.id && due.amount > 0
    );

    if (aOwesB) {
      CommercialBank.creditAccount(b, a, aOwesB.amount);
    } else if (bOwesA) {
      CommercialBank.creditAccount(a, b, bOwesA.amount);
    }
    this.clearDues(a, b);
    this.clearDues(b, a);
  }

  static clearDues(a: Bank, b: Bank) {
    a.setAccount(b.id, "assets", "dues", 0);
    a.setAccount(b.id, "liabilities", "dues", 0);
  }

  // static clearCorrespondingDues(a: Bank, b: Bank) {
  //   a.setAccount(b.id, "assets", "dues", 0);
  //   a.setAccount(b.id, "liabilities", "dues", 0);
  //   b.setAccount(a.id, "assets", "dues", 0);
  //   b.setAccount(a.id, "liabilities", "dues", 0);
  // }
  // static clearSubordinateDues(a: Bank, b: Bank) {
  //   a.setAccount(b.id, "assets", "dues", 0);
  //   b.setAccount(a.id, "liabilities", "dues", 0);
  // }

  // hasReserves(amount: number): boolean {
  //   return this.reserves - amount < 0 ? false : true;
  // }
  // static openAccount(c: Bank, b: Bank) {
  //   c.accounts = [
  //     ...c.accounts,
  //     { id: b.id, type: "customerDeposits", balance: 0 },
  //   ];
  //   b.accounts = [
  //     ...b.accounts,
  //     { id: c.id, type: "customerDeposits", balance: 0 },
  //   ];
  // }
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
      ClearingHouse.openAccount(this, bankLookup["clearinghouse"]);
    }
  }
  //   deposit(amount: number) {
  //     this.reserves += amount;
  //   }
  //   withdraw(amount: number) {
  //     this.reserves -= amount;
  //   }
  //   static creditAccount(a: Bank, b: Bank, amount: number) {
  //     b.increaseBalance(a.id, amount, "bankDeposits");
  //     Bank.mapBalance(a, b, "bankDeposits", "bankOverdrafts");
  //   }
  //   static debitAccount(a: Bank, b: Bank, amount: number) {
  //     b.decreaseBalance(a.id, amount, "bankDeposits");
  //     Bank.mapBalance(a, b, "bankDeposits", "bankOverdrafts");
  //   }

  //   static netAccountsAndTransfer(a: Bank, b: Bank) {
  //     a.netAccounts(b);
  //     b.netAccounts(a);
  //     const aIsLiable = a.assets.dues.find(
  //       (due) => due.id === b.id && due.amount > 0
  //     );
  //     const bIsLiable = b.assets.dues.find(
  //       (due) => due.id === a.id && due.amount > 0
  //     );
  //     if (aIsLiable) {
  //       CommercialBank.creditAccount(a, b, aIsLiable.amount);
  //     } else if (bIsLiable) {
  //       CommercialBank.creditAccount(b, a, bIsLiable.amount);
  //     }
  //     this.clearCorrespondingDues(a, b);
  //   }
  static debitAccount(a: CommercialBank, b: CommercialBank, amount: number) {
    Bank.debitAccount(a, b, amount, ["bankDeposits", "bankOverdrafts"]);
  }
  static creditAccount(a: CommercialBank, b: CommercialBank, amount: number) {
    Bank.creditAccount(a, b, amount, ["bankDeposits", "bankOverdrafts"]);
  }
  static deposit(a: CommercialBank, b: CommercialBank, amount: number) {
    this.creditAccount(a, b, amount);
    a.reserves -= amount;
    b.reserves += amount;
  }
  static withdraw(a: CommercialBank, b: CommercialBank, amount: number) {
    this.debitAccount(a, b, amount);
    a.reserves += amount;
    b.reserves -= amount;
  }
  static openAccount(c: Bank, b: Bank) {
    Bank.createSubordinateAccount(c, b, 0, "bankDeposits", "bankOverdrafts");
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
  //   static createLoan(
  //     a: Customer,
  //     b: CommercialBank,
  //     amount: number,
  //     rate: number = 10
  //   ) {
  //     const interest = (amount * rate) / 100;
  //     const amountPlusInterest = amount + interest;
  //     a.createInstrumentAccount(
  //       b.id,
  //       "liabilities",
  //       "customerLoans",
  //       amountPlusInterest
  //     );
  //     b.createInstrumentAccount(
  //       a.id,
  //       "assets",
  //       "customerLoans",
  //       amountPlusInterest
  //     );
  //     this.creditAccount(a, b, amount);
  //   }
  //   static repayLoan(a: Customer, b: CommercialBank, amount: number) {
  //     this.debitAccount(a, b, amount);
  //     const loanAmount = b.getAccount(a.id, "assets", "customerLoans");
  //     if (amount > loanAmount.amount) {
  //       amount = loanAmount.amount;
  //     }
  //     a.decreaseInstrument(b.id, "liabilities", "customerLoans", amount);
  //     b.decreaseInstrument(a.id, "assets", "customerLoans", amount);
  //   }
  //   static repayLoanReserves(a: Customer, b: CommercialBank, amount: number) {
  //     a.decreaseReserves(amount);
  //     b.increaseReserves(amount);
  //     a.decreaseInstrument(b.id, "liabilities", "customerLoans", amount);
  //     b.decreaseInstrument(a.id, "assets", "customerLoans", amount);
  //   }

  static deposit(a: Customer, b: CommercialBank, amount: number) {
    Bank.creditAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    a.reserves -= amount;
    b.reserves += amount;
  }
  static withdraw(a: Customer, b: CommercialBank, amount: number) {
    Bank.debitAccount(a, b, amount, ["customerDeposits", "customerOverdrafts"]);
    a.reserves += amount;
    b.reserves -= amount;
  }
  static automateTransferFromAccount(c: Customer) {
    const accountWithMostCash = c.accounts.sort((acc1, acc2) => {
      if (acc1.balance > acc2.balance) {
        return 1;
      }

      if (acc1.balance < acc2.balance) {
        return -1;
      }

      return 0;
    });

    const bankId = accountWithMostCash[0].id.split("-")[1].toString();
    const customersBank = bankLookup[bankId];
    return customersBank;
  }
  static automateTransferToAccount(c: Customer) {
    const accountWithLeastCash = c.accounts.sort((acc1, acc2) => {
      if (acc1.balance < acc2.balance) {
        return 1;
      }

      if (acc1.balance > acc2.balance) {
        return -1;
      }

      return 0;
    });
    const bankId = accountWithLeastCash[0].id.split("-")[1].toString();
    let customersBank = bankLookup[bankId];
    return customersBank;
  }
  static transfer(customerA: Customer, customerB: Customer, amount: number) {
    const bankA = this.automateTransferFromAccount(customerA);
    const bankB = this.automateTransferToAccount(customerB);
    Bank.debitAccount(customerA, bankA, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    Bank.creditAccount(customerB, bankB, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    Bank.handleSystem(bankA, bankB, amount);
    systemtype.increaseDues(bankA, bankB, amount);
  }
  static openAccount(c: Bank, b: Bank) {
    Bank.createSubordinateAccount(
      c,
      b,
      0,
      "customerDeposits",
      "customerOverdrafts"
    );
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
  static netDues(bank: Bank) {
    let bankDueFrom = bank.assets.dues.find(
      (due) => due.id === bankLookup["clearinghouse"].id
    );
    let clearinghouseDueFrom = bankLookup[
      "clearinghouse"
    ].liabilities.dues.find((due) => due.id === bank.id);
    if (clearinghouseDueFrom && bankDueFrom) {
      clearinghouseDueFrom.amount = bankDueFrom.amount;
    }
    let bankDueTo = bank.liabilities.dues.find(
      (due) => due.id === bankLookup["clearinghouse"].id
    );
    let clearinghouseDueTo = bankLookup["clearinghouse"].assets.dues.find(
      (due) => due.id === bank.id
    );
    if (clearinghouseDueTo && bankDueTo) {
      clearinghouseDueTo.amount = bankDueTo.amount;
    }
  }
  static settleDues() {
    for (const bank in bankLookup) {
      bankLookup[bank].liabilities.dues.forEach((due) => {
        if (due.amount > 0 && bankLookup[bank].id === "clearinghouse") {
          ClearingHouse.creditAccount(
            bankLookup[due.id],
            bankLookup[bank],
            due.amount,
            ["chCertificates", "chOverdrafts"]
          );
        } else if (due.amount > 0 && bankLookup[bank].id !== "clearinghouse") {
          ClearingHouse.debitAccount(
            bankLookup[bank],
            bankLookup[due.id],
            due.amount,
            ["chCertificates", "chOverdrafts"]
          );
        }
        Bank.clearDues(bankLookup[bank], bankLookup[due.id]);
      });
    }
  }
  //do extra checks??
  // console.log(bankLookup["clearinghouse"])
  //   const aOwesB = a.liabilities.dues.find(
  //     (due) => due.id === b.id && due.amount > 0
  //   );
  //   const bOwesA = b.liabilities.dues.find(
  //     (due) => due.id === a.id && due.amount > 0
  //   );
  //   if (aOwesB) {
  //     this.creditAccount(b, a, aOwesB.amount);
  //   } else if (bOwesA) {
  //     this.creditAccount(a, b, bOwesA.amount);
  //   }
  //   this.clearDues(a, b);
  //   this.clearDues(b, a);
  // }
  // static debitAccount(a: Bank, b: Bank, amount: number) {
  //   Bank.debitAccount(a, b, amount, ["chCertificates", "chOverdrafts"]);
  // }
  // static creditAccount(a: Bank, b: Bank, amount: number) {
  //   Bank.creditAccount(a, b, amount, ["chCertificates", "chOverdrafts"]);
  // }
  // }
  static openAccount(a: Bank, b: Bank) {
    Bank.createSubordinateAccount(a, b, 0, "chCertificates", "chOverdrafts");
    // Bank.createSubordinateAccount(b, a, 0, "chCertificates", "chOverdrafts");
  }
  static creditAccount(
    a: Bank,
    b: Bank,
    amount: number,
    instruments: InstrumentKey[]
  ) {
    const id = `${a.id}-${b.id}`;
    const aAccount = a.accounts.find((account: any) => account.id === id);
    const bAccount = b.accounts.find((account: any) => account.id === id);
    aAccount.balance += amount;
    bAccount.balance += amount;
    const [creditInstrument, debtInstrument] = instruments;
    Bank.mapBalance(a, b, creditInstrument, debtInstrument, aAccount.balance);
  }

  static debitAccount(
    a: Bank,
    b: Bank,
    amount: number,
    instruments: InstrumentKey[]
  ) {
    const id = `${a.id}-${b.id}`;
    const aAccount = a.accounts.find((account: any) => account.id === id);
    const bAccount = b.accounts.find((account: any) => account.id === id);
    aAccount.balance -= amount;
    bAccount.balance -= amount;
    const [creditInstrument, debtInstrument] = instruments;
    Bank.mapBalance(a, b, creditInstrument, debtInstrument, aAccount.balance);
  }
}
// export class ClearingHouse {
// static create(
//   banks: Bank[],
//   clearingHouse: Bank,
//   subscription: number = 500
// ) {
//   clearingHouse.reserves = 0;
//   members = [...members, ...banks];
//   banks.forEach((bank) => {
//     Bank.createSubordinateAccount(
//       bank,
//       clearingHouse,
//       subscription,
//       "chCertificates",
//       "chOverdrafts"
//     );
//     bank.reserves -= subscription;
//     clearingHouse.reserves += subscription;
//   });
//   ch = clearingHouse;
// }
// static transfer(bank: Bank, clearingHouse: Bank) {
//   const bankIsLiable = bank.liabilities.dues.find(
//     (due) => due.id === clearingHouse.id && due.amount > 0
//   );
//   const clearingHouseIsLiable = bank.assets.dues.find(
//     (due) => due.id === clearingHouse.id && due.amount > 0
//   );
//   if (bankIsLiable) {
//     clearingHouse.decreaseBalance(
//       bank.id,
//       bankIsLiable.amount,
//       "chCertificates"
//     );
//     Bank.mapBalance(bank, clearingHouse, "chCertificates", "chOverdrafts");
//     Bank.clearSubordinateDues(clearingHouse, bank);
//   } else if (clearingHouseIsLiable) {
//     clearingHouse.increaseBalance(
//       bank.id,
//       clearingHouseIsLiable.amount,
//       "chCertificates"
//     );
//     Bank.mapBalance(bank, clearingHouse, "chCertificates", "chOverdrafts");
//     Bank.clearSubordinateDues(bank, clearingHouse);
//   }
// }
// static totalAccounts(bank: Bank, clearingHouse: Bank) {
//   const isMember = members.find((m) => (m.id = bank.id));
//   if (isMember) {
//     const totalDueFroms = bank.reduceAccounts(bank, "assets", "dues");
//     const totalDueTos = bank.reduceAccounts(bank, "liabilities", "dues");
//     if (ch) {
//       if (totalDueTos.amount > totalDueFroms.amount) {
//         const netTotal = totalDueTos.amount - totalDueFroms.amount;
//         clearingHouse.increaseDues(bank.id, "assets", netTotal);
//         bank.increaseDues(clearingHouse.id, "liabilities", netTotal);
//         bank.liabilities.dues = bank.liabilities.dues.filter(
//           (due) => due.id === clearingHouse?.id
//         );
//         bank.assets.dues = [{ id: clearingHouse.id, type: "clearingHouseCertificates", amount: 0 }];
//       } else if (totalDueFroms.amount > totalDueTos.amount) {
//         const netTotal = totalDueFroms.amount - totalDueTos.amount;
//         clearingHouse.increaseDues(bank.id, "liabilities", netTotal);
//         bank.increaseDues(clearingHouse.id, "assets", netTotal);
//         bank.assets.dues = bank.assets.dues.filter(
//           (due) => due.id === clearingHouse?.id
//         );
//         bank.liabilities.dues = [{ id: clearingHouse.id, type: "clearingHouseCertificates", amount: 0 }];
//       }
//       return { totalDueFroms, totalDueTos };
//     }
//   } else {
//     const totalDueFroms = bank.reduceAccounts(bank, "assets", "dues");
//     const totalDueTos = bank.reduceAccounts(bank, "liabilities", "dues");
//     return { totalDueFroms, totalDueTos };
//   }
// }
// static settleAccount(bank: Bank, clearingHouse: Bank) {
//   this.totalAccounts(bank, clearingHouse);
//   this.transfer(bank, clearingHouse);
// }
// static settleAllAcounts(banks: Bank[], clearingHouse: Bank) {
//   banks.forEach((bank) => {
//     this.totalAccounts(bank, clearingHouse);
//     this.transfer(bank, clearingHouse);
//   });
// }
// static get() {
//   return ch;
// }

// }
