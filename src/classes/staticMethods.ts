import {
  Bank,
  bankLookup,
  ClearingHouse,
  CommercialBank,
  Customer,
} from "./classes2";
import { InstrumentKey } from "./types";

interface SystemLookup {
  [key: string]: boolean;
}

export const bankingSystem: SystemLookup = {
  correspondent: false,
  clearinghouse: false,
  centralbank: false,
};

export class StaticMethods {
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
    this.createAccount(a, b, creditInstrument);
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
    StaticMethods.mapBalance(a, b, creditInstrument, debtInstrument, aAccount.balance);
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
    StaticMethods.mapBalance(a, b, creditInstrument, debtInstrument, aAccount.balance);
  }
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
  static newSettleDues() {
    if (bankingSystem.clearinghouse) {
      ClearingHouseService.settleDues();
    } else {
      for (const bank in bankLookup) {
        bankLookup[bank].liabilities.dues.forEach((due) => {
          CommercialBankService.creditAccount(
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
    const aOwesB = a.liabilities.dues.find(
      (due) => due.id === b.id && due.amount > 0
    );
    const bOwesA = b.liabilities.dues.find(
      (due) => due.id === a.id && due.amount > 0
    );

    if (aOwesB) {
      CommercialBankService.creditAccount(b, a, aOwesB.amount);
    } else if (bOwesA) {
      CommercialBankService.creditAccount(a, b, bOwesA.amount);
    }
    this.clearDues(a, b);
    this.clearDues(b, a);
  }

  static clearDues(a: Bank, b: Bank) {
    a.setAccount(b.id, "assets", "dues", 0);
    a.setAccount(b.id, "liabilities", "dues", 0);
  }
}

export class CustomerService {
  static deposit(a: Customer, b: CommercialBank, amount: number) {
    StaticMethods.creditAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    a.reserves -= amount;
    b.reserves += amount;
  }
  static withdraw(a: Customer, b: CommercialBank, amount: number) {
    StaticMethods.debitAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
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
    StaticMethods.debitAccount(customerA, bankA, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    StaticMethods.creditAccount(customerB, bankB, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    StaticMethods.handleSystem(bankA, bankB, amount);
  }
  static openAccount(c: Bank, b: Bank) {
    StaticMethods.createSubordinateAccount(
      c,
      b,
      0,
      "customerDeposits",
      "customerOverdrafts"
    );
  }
  // static createLoan(
  //   a: Customer,
  //   b: CommercialBank,
  //   amount: number,
  //   rate: number = 10
  // ) {
  //   const interest = (amount * rate) / 100;
  //   const amountPlusInterest = amount + interest;
  //   a.createInstrumentAccount(
  //     b.id,
  //     "liabilities",
  //     "customerLoans",
  //     amountPlusInterest
  //   );
  //   b.createInstrumentAccount(
  //     a.id,
  //     "assets",
  //     "customerLoans",
  //     amountPlusInterest
  //   );
  //   this.creditAccount(a, b, amount);
  // }
  // static repayLoan(a: Customer, b: CommercialBank, amount: number) {
  //   this.debitAccount(a, b, amount);
  //   const loanAmount = b.getAccount(a.id, "assets", "customerLoans");
  //   if (amount > loanAmount.amount) {
  //     amount = loanAmount.amount;
  //   }
  //   a.decreaseInstrument(b.id, "liabilities", "customerLoans", amount);
  //   b.decreaseInstrument(a.id, "assets", "customerLoans", amount);
  // }
  // static repayLoanReserves(a: Customer, b: CommercialBank, amount: number) {
  //   a.decreaseReserves(amount);
  //   b.increaseReserves(amount);
  //   a.decreaseInstrument(b.id, "liabilities", "customerLoans", amount);
  //   b.decreaseInstrument(a.id, "assets", "customerLoans", amount);
  // }
}

export class CommercialBankService {
  static debitAccount(a: CommercialBank, b: CommercialBank, amount: number) {
    StaticMethods.debitAccount(a, b, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
  }
  static creditAccount(a: CommercialBank, b: CommercialBank, amount: number) {
    StaticMethods.creditAccount(a, b, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
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
    StaticMethods.createSubordinateAccount(
      c,
      b,
      0,
      "bankDeposits",
      "bankOverdrafts"
    );
  }
}

export class ClearingHouseService {
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
          StaticMethods.creditAccount(
            bankLookup[due.id],
            bankLookup[bank],
            due.amount,
            ["chCertificates", "chOverdrafts"]
          );
        } else if (due.amount > 0 && bankLookup[bank].id !== "clearinghouse") {
          StaticMethods.debitAccount(
            bankLookup[bank],
            bankLookup[due.id],
            due.amount,
            ["chCertificates", "chOverdrafts"]
          );
        }
        StaticMethods.clearDues(bankLookup[bank], bankLookup[due.id]);
      });
    }
  }
  static openAccount(c: Bank, b: Bank) {
    StaticMethods.createSubordinateAccount(
      c,
      b,
      0,
      "chCertificates",
      "chOverdrafts"
    );
  }
}
