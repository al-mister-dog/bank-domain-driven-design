import { Bank, bankLookup, CommercialBank, Customer } from "./instances";
import { SystemMethods } from "./system-methods";
import { PaymentMethods, AccountMethods } from "./methods";

interface SystemLookup {
  [key: string]: boolean;
}

export const bankingSystem: SystemLookup = {
  correspondent: false,
  clearinghouse: false,
  centralbank: false,
};



export class CustomerService {
  static deposit(a: Customer, b: CommercialBank, amount: number) {
    PaymentMethods.creditAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    a.reserves -= amount;
    b.reserves += amount;
  }
  static withdraw(a: Customer, b: CommercialBank, amount: number) {
    PaymentMethods.debitAccount(a, b, amount, [
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
    const bankA = CustomerService.automateTransferFromAccount(customerA);
    const bankB = CustomerService.automateTransferToAccount(customerB);
    PaymentMethods.debitAccount(customerA, bankA, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    PaymentMethods.creditAccount(customerB, bankB, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    if (bankA.id !== bankB.id) {
      SystemMethods.increaseDues(bankA, bankB, amount);
    }
  }
  static openAccount(bankA: Bank, bankB: Bank) {
    AccountMethods.createSubordinateAccount(
      bankA,
      bankB,
      0,
      "customerDeposits",
      "customerOverdrafts"
    );
  }
  static createLoan(
    a: Customer,
    b: CommercialBank,
    amount: number,
    rate: number = 10
  ) {
    const interest = (amount * rate) / 100;
    const amountPlusInterest = amount + interest;
    a.createInstrumentAccount(
      b.id,
      "liabilities",
      "customerLoans",
      amountPlusInterest
    );
    b.createInstrumentAccount(
      a.id,
      "assets",
      "customerLoans",
      amountPlusInterest
    );
    PaymentMethods.creditAccount(a, b, amount, ["customerDeposits", "customerOverdrafts"]);
  }
  static repayLoan(a: Customer, b: CommercialBank, amount: number) {
    PaymentMethods.debitAccount(a, b, amount, ["customerDeposits", "customerOverdrafts"]);
    const loanAmount = b.assets.customerLoans.find((loan) => loan.id === a.id)
    if (loanAmount) {
      if (amount > loanAmount.amount) {
        amount = loanAmount.amount;
      }
      a.decreaseInstrument(b.id, "liabilities", "customerLoans", amount);
      b.decreaseInstrument(a.id, "assets", "customerLoans", amount);
    }
    
  }
  static repayLoanReserves(a: Customer, b: CommercialBank, amount: number) {
    a.decreaseReserves(amount);
    b.increaseReserves(amount);
    a.decreaseInstrument(b.id, "liabilities", "customerLoans", amount);
    b.decreaseInstrument(a.id, "assets", "customerLoans", amount);
  }
}

export class BankService {
  static deposit(a: CommercialBank, b: CommercialBank, amount: number) {
    PaymentMethods.creditAccount(a, b, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
    a.reserves -= amount;
    b.reserves += amount;
  }
  static withdraw(a: CommercialBank, b: CommercialBank, amount: number) {
    PaymentMethods.debitAccount(a, b, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
    a.reserves += amount;
    b.reserves -= amount;
  }
  static openAccount(c: Bank, b: Bank) {
    AccountMethods.createSubordinateAccount(
      c,
      b,
      0,
      "bankDeposits",
      "bankOverdrafts"
    );
  }
  static netDues(bank: Bank) {
    SystemMethods.netDues(bank);
  }

  //if you only want services to be publically available
  static creditAccount(bankA: Bank, bankB: Bank, amount: number) {
    PaymentMethods.creditAccount(bankA, bankB, amount, ["bankDeposits", "bankOverdrafts"])
  }
  static debitAccount(bankA: Bank, bankB: Bank, amount: number) {
    PaymentMethods.debitAccount(bankA, bankB, amount, ["bankDeposits", "bankOverdrafts"])
  }
  static settleDues() {
    SystemMethods.settleDues()
  }
}

export class ClearingHouseService {
  static settleDues() {
    for (const bank in bankLookup) {
      bankLookup[bank].liabilities.dues.forEach((due) => {
        if (due.amount > 0 && bankLookup[bank].id === "clearinghouse") {
          PaymentMethods.creditAccount(
            bankLookup[due.id],
            bankLookup[bank],
            due.amount,
            ["chCertificates", "chOverdrafts"]
          );
        } else if (due.amount > 0 && bankLookup[bank].id !== "clearinghouse") {
          PaymentMethods.debitAccount(
            bankLookup[bank],
            bankLookup[due.id],
            due.amount,
            ["chCertificates", "chOverdrafts"]
          );
        }
        PaymentMethods.clearDues(bankLookup[bank], bankLookup[due.id]);
      });
    }
  }
  static openAccount(c: Bank, b: Bank) {
    AccountMethods.createSubordinateAccount(
      c,
      b,
      0,
      "chCertificates",
      "chOverdrafts"
    );
  }
}
