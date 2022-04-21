// import { Account, Category, CategoryKey, InstrumentKey, IBank } from "./types";

// export class Bank implements IBank {
//   constructor(
//     public id: string,
//     public assets: Category,
//     public liabilities: Category,
//     public balances: Category
//   ) {}
//   createAccount(
//     id: string,
//     category: CategoryKey,
//     instrument: InstrumentKey,
//     amount: number = 0
//   ) {
//     if (!this[category][instrument]) {
//       return;
//     }
//     this[category][instrument] = [
//       ...this[category][instrument],
//       { id, amount },
//     ];
//   }
//   createAccountTest(
//     b1: Bank,
//     b2: Bank,
//     category: CategoryKey,
//     instrument: InstrumentKey,
//     amount: number = 0
//   ) {
//     let accountId = `${b1.id}w/${b2.id}`;
//     if (!this[category][instrument]) {
//       return;
//     }
//     this[category][instrument] = [
//       ...this[category][instrument],
//       { id: accountId, amount },
//     ];
//   }
//   findAccount(id: string, category: CategoryKey, instrument: InstrumentKey) {
//     let account = this[category][instrument].find(
//       (acc: Account) => acc.id === id
//     );
//     return account ? true : false;
//   }
//   findAccountIndex(
//     id: string,
//     category: CategoryKey,
//     instrument: InstrumentKey
//   ) {
//     const index = this[category][instrument].findIndex((acc: Account) => {
//       return acc.id === id;
//     });
//     return index;
//   }
//   addToAccount(
//     id: string,
//     category: CategoryKey,
//     instrument: InstrumentKey,
//     amount: number
//   ) {
//     const index = this.findAccountIndex(id, category, instrument);
//     this[category][instrument][index].amount += amount;
//   }
//   minusFromAccount(
//     id: string,
//     category: CategoryKey,
//     instrument: InstrumentKey,
//     amount: number
//   ) {
//     const index = this.findAccountIndex(id, category, instrument);
//     this[category][instrument][index].amount -= amount;
//   }

//   static transferDeposit(
//     b1: Bank,
//     b2: Bank,
//     amount: number,
//     instrument: InstrumentKey,
//     credit: boolean
//   ) {
//     Bank.handleTransfer(b1, b2, "assets", instrument, amount, credit);
//     Bank.handleTransfer(b2, b1, "liabilities", instrument, amount, credit);
//   }
//   static handleTransfer(
//     b1: Bank,
//     b2: Bank,
//     category: CategoryKey,
//     instrument: InstrumentKey,
//     amount: number,
//     credit: boolean
//   ) {
//     if (!b1.findAccount(b2.id, category, instrument)) {
//       b1.createAccount(b2.id, category, instrument);
//     }
//     if (credit) {
//       b1.addToAccount(b2.id, category, instrument, amount);
//     } else {
//       b1.minusFromAccount(b2.id, category, instrument, amount);
//     }
//   }
//   mapBalance(
//     b1: Bank,
//     categories: CategoryKey[],
//     instruments: InstrumentKey[]
//   ) {
//     const balanceIndex = this.findAccountIndex(b1.id, "balances", instruments[0]);
//     const index1 = this.findAccountIndex(b1.id, categories[0], instruments[0]);
//     const index2 = this.findAccountIndex(b1.id, categories[1], instruments[1]);
//     const balance = this.balances.customerDeposits[balanceIndex].amount;
//     if (balance < 0) {
//       this[categories[0]][instruments[0]][index2].amount = 0;
//       this[categories[1]][instruments[1]][index1].amount = -balance;
//     } else if (balance > 0) {
//       this[categories[0]][instruments[0]][index1].amount = balance;
//       this[categories[1]][instruments[1]][index2].amount = 0;
//     } else {
//       this[categories[0]][instruments[0]][index1].amount = 0;
//       this[categories[1]][instruments[1]][index2].amount = 0;
//     }
// // barclays.assets.deposits(hsbc, 1000)
// // barclays.assets.overdrafts(hsbc, 100)
// // barclays.liabilities.deposits(hsbc, 0)
// // barclays.liabilities.overdrafts(hsbc, 0)
// // hsbc.assets.deposits(hsbc, 0)
// // hsbc.assets.overdrafts(hsbc, 0)
// // hsbc.liabilities.deposits(hsbc, 1000)
// // hsbc.liabilities.overdrafts(hsbc, 100)
//   }

//   static createCorrespondingAccounts(
//     b1: Bank,
//     b2: Bank,
//     amount: number,
//     instrument: InstrumentKey
//   ) {
//     b1.createAccount(b2.id, "assets", instrument, amount);
//     b1.createAccount(b2.id, "liabilities", instrument, amount);
//     b1.createAccount(b2.id, "balances", instrument, amount);
//     b2.createAccount(b1.id, "assets", instrument, amount);
//     b2.createAccount(b1.id, "liabilities", instrument, amount);
//     b2.createAccount(b1.id, "balances", instrument, amount);
//     b1.createAccount(b2.id, "liabilities", "customerOverdrafts", amount);
//   }
// }

// export class CommercialBank extends Bank {
//   constructor(
//     public id: string,
//     public assets: Category,
//     public liabilities: Category,
//     public balances: Category,
//     public reserves: number = 0
//   ) {
//     super(id, assets, liabilities, balances);
//   }
//   deposit(amount: number) {
//     this.reserves += amount;
//   }
//   withdraw(amount: number) {
//     this.reserves -= amount;
//   }
// }

// export class CorrespondentBank extends Bank {
//   constructor(
//     public id: string,
//     public assets: Category,
//     public liabilities: Category,
//     public balances: Category,
//     public reserves: number = 0
//   ) {
//     super(id, assets, liabilities, balances);
//   }
//   static creditAccount(
//     b1: Bank,
//     b2: Bank,
//     amount: number,
//     instrument: InstrumentKey
//   ) {
//     Bank.transferDeposit(b1, b2, amount, instrument, true);
//   }
//   static debitAccount(
//     b1: Bank,
//     b2: Bank,
//     amount: number,
//     instrument: InstrumentKey
//   ) {
//     Bank.transferDeposit(b2, b1, amount, instrument, false);
//   }
  
//   static createCorrespondingAccountsTest(
//     a: CorrespondentBank,
//     b: CorrespondentBank,
//     amount: number
//   ) {
//     a.createAccount(b.id, "assets", "bankDeposits", amount);
//     a.createAccount(b.id, "liabilities", "bankDeposits", amount);
//     a.createAccount(b.id, "assets", "bankOverdrafts", amount);
//     a.createAccount(b.id, "liabilities", "bankOverdrafts", amount);
//     a.createAccountTest(a, b, "balances", "bankDeposits", amount);
//     b.createAccountTest(a, b, "balances", "bankDeposits", amount);

//     b.createAccount(a.id, "assets", "bankOverdrafts", amount);
//     b.createAccount(a.id, "liabilities", "bankOverdrafts", amount);
//     b.createAccount(a.id, "assets", "bankDeposits", amount);
//     b.createAccount(a.id, "liabilities", "bankDeposits", amount);
//     b.createAccountTest(b, a, "balances", "bankDeposits", amount);
//     a.createAccountTest(b, a, "balances", "bankDeposits", amount);
//   }
// }

// export class Customer extends Bank {
//   constructor(
//     public id: string,
//     public assets: Category,
//     public liabilities: Category,
//     public balances: Category,
//     public cash: number = 0
//   ) {
//     super(id, assets, liabilities, balances);
//   }
//   deposit(amount: number) {
//     this.cash -= amount;
//   }
//   withdraw(amount: number) {
//     this.cash += amount;
//   }

//   static makeDeposit(c1: Customer, b1: CommercialBank, amount: number) {
//     c1.addToAccount(b1.id, "balances", "customerDeposits", amount);
//     b1.addToAccount(c1.id, "balances", "customerDeposits", amount);
//     c1.mapBalance(
//       b1,
//       ["assets", "liabilities"],
//       ["customerDeposits", "customerOverdrafts"]
//     );
//     b1.mapBalance(
//       c1,
//       ["liabilities", "assets"],
//       ["customerDeposits", "customerOverdrafts"]
//     );
//     c1.deposit(amount);
//     b1.deposit(amount);
//   }
//   static makeWithdrawal(c1: Customer, b1: CommercialBank, amount: number) {
//     c1.minusFromAccount(b1.id, "balances", "customerDeposits", amount);
//     b1.minusFromAccount(c1.id, "balances", "customerDeposits", amount);
//     c1.mapBalance(
//       b1,
//       ["assets", "liabilities"],
//       ["customerDeposits", "customerOverdrafts"]
//     );
//     b1.mapBalance(
//       c1,
//       ["liabilities", "assets"],
//       ["customerDeposits", "customerOverdrafts"]
//     );
//     c1.deposit(amount);
//     b1.deposit(amount);
//   }
//   static createCorrespondingAccounts(
//     c: Customer,
//     b: CommercialBank,
//     amount: number
//   ) {
//     c.createAccount(b.id, "assets", "customerDeposits", amount);
//     c.createAccount(b.id, "liabilities", "customerOverdrafts", amount);
//     c.createAccount(b.id, "balances", "customerDeposits", amount);
//     b.createAccount(c.id, "assets", "customerOverdrafts", amount);
//     b.createAccount(c.id, "liabilities", "customerDeposits", amount);
//     b.createAccount(c.id, "balances", "customerDeposits", amount);
//   }
// }

// //TODO: MAKE THE NEGATIVE FUNCTION DYNAMIC
