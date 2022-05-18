import {
  Bank,
  CommercialBank,
  Customer,
  ExchangeBank,
  Trader,
} from "./instances";
import { SystemMethods } from "./systems";
import { PaymentMethods, AccountMethods } from "./methods";
import { bankLookup } from "./lookupTables";
import { Bill } from "./types";



interface SystemLookup {
  [key: string]: boolean;
}

export const bankingSystem: SystemLookup = {
  correspondent: false,
  clearinghouse: false,
  centralbank: false,
};

export class BankService {
  static deposit(a: CommercialBank, b: CommercialBank, amount: number) {
    PaymentMethods.creditAccount(a, b, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
    a.decreaseReserves(amount);
    b.increaseReserves(amount);
  }
  static withdraw(a: CommercialBank, b: CommercialBank, amount: number) {
    PaymentMethods.debitAccount(a, b, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
    a.increaseReserves(amount);
    b.decreaseReserves(amount);
  }
  static openAccount(a: Bank, b: Bank, amount: number = 0) {
    AccountMethods.createSubordinateAccount(
      a,
      b,
      amount,
      "bankDeposits",
      "bankOverdrafts"
    );
  }
  static netDues(bank: Bank) {
    SystemMethods.netDues(bank);
  }
  static settleDues() {
    SystemMethods.settleDues();
  }
  //if you only want services to be publically available
  static creditAccount(bankA: Bank, bankB: Bank, amount: number) {
    PaymentMethods.creditAccount(bankA, bankB, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
  }
  static debitAccount(bankA: Bank, bankB: Bank, amount: number) {
    PaymentMethods.debitAccount(bankA, bankB, amount, [
      "bankDeposits",
      "bankOverdrafts",
    ]);
  }
}

export class CustomerService {
  static deposit(a: Customer, b: CommercialBank, amount: number) {
    PaymentMethods.creditAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    a.decreaseReserves(amount);
    b.increaseReserves(amount);
  }
  static withdraw(a: Customer, b: CommercialBank, amount: number) {
    PaymentMethods.debitAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    a.increaseReserves(amount);
    b.decreaseReserves(amount);
  }
  private static automateTransferFromAccount(c: Customer) {
    const accountWithMostCash = c.balances.customerDeposits.sort(
      (acc1, acc2) => {
        if (acc1.amount < acc2.amount) {
          return 1;
        }

        if (acc1.amount > acc2.amount) {
          return -1;
        }

        return 0;
      }
    )[0];
    const bankId = accountWithMostCash.id.split("-")[1].toString();
    const customersBank = bankLookup[bankId];
    return customersBank;
  }
  private static automateTransferToAccount(c: Customer) {
    const accountWithLeastCash = c.balances.customerDeposits.sort(
      (acc1, acc2) => {
        if (acc1.amount > acc2.amount) {
          return 1;
        }

        if (acc1.amount < acc2.amount) {
          return -1;
        }
        return 0;
      }
    )[0];
    const bankId = accountWithLeastCash.id.split("-")[1].toString();
    let customersBank = bankLookup[bankId];
    return customersBank;
  }
  static transfer(
    customerA: Customer,
    customerB: Customer,
    amount: number,
    bank1?: Bank,
    bank2?: Bank
  ) {
    let bankA: Bank;
    let bankB: Bank;
    if (bank1) {
      bankA = bank1;
    } else {
      bankA = CustomerService.automateTransferFromAccount(customerA);
    }
    if (bank2) {
      bankB = bank2;
    } else {
      bankB = CustomerService.automateTransferToAccount(customerB);
    }

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
  static openAccount(customer: Customer, bankB: Bank) {
    AccountMethods.createSubordinateAccount(
      customer,
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
    a.createInstrument(
      b.id,
      "liabilities",
      "customerLoans",
      amountPlusInterest
    );
    b.createInstrument(a.id, "assets", "customerLoans", amountPlusInterest);
    PaymentMethods.creditAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
  }
  static repayLoan(a: Customer, b: CommercialBank, amount: number) {
    PaymentMethods.debitAccount(a, b, amount, [
      "customerDeposits",
      "customerOverdrafts",
    ]);
    const loanAmount = b.assets.customerLoans.find((loan) => loan.id === a.id);
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

export class ClearingHouseService {
  static settleDues() {
    for (const bank in bankLookup) {
      bankLookup[bank].liabilities.dues.forEach((due) => {
        const clearinghouseOwesBank =
          due.amount > 0 &&
          bankLookup[bank].id === "clearinghouse" &&
          due.id !== "clearinghouse";
        const bankOwesClearinghouse =
          due.amount > 0 &&
          bankLookup[bank].id !== "clearinghouse" &&
          due.id === "clearinghouse";
        if (clearinghouseOwesBank) {
          PaymentMethods.creditAccount(
            bankLookup[due.id],
            bankLookup[bank],
            due.amount,
            ["chCertificates", "chOverdrafts"]
          );
        } else if (bankOwesClearinghouse) {
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
  static openAccount(bankA: Bank, bankB: Bank, amount: number = 0) {
    AccountMethods.createSubordinateAccount(
      bankA,
      bankB,
      amount,
      "chCertificates",
      "chOverdrafts"
    );
    bankB.increaseReserves(amount);
  }
}


interface ExchangeLookup {
  [key: string]: number;
}
interface CertaintyLookup {
  [key: string]: boolean;
}
const exchangeRates: ExchangeLookup = {
  florence: 66,
  lyons: 64,
};
const certaintyQuotes: CertaintyLookup = {
  florence: false,
  lyons: true,
};
export class ExchangeBankService {
  static createCorrespondence(
    bankA: ExchangeBank,
    bankB: ExchangeBank,
    amount: number
  ) {
    bankA.accounts.vostro = [
      ...bankA.accounts.vostro,
      { id: bankB.id, type: "bankDeposits", amount },
    ];
    bankA.accounts.nostro = [
      ...bankA.accounts.nostro,
      { id: bankB.id, type: "bankDeposits", amount },
    ];
    bankB.accounts.vostro = [
      ...bankB.accounts.vostro,
      { id: bankA.id, type: "bankDeposits", amount },
    ];
    bankB.accounts.nostro = [
      ...bankB.accounts.nostro,
      { id: bankA.id, type: "bankDeposits", amount },
    ];
    BankService.openAccount(bankA, bankB, amount);
    BankService.openAccount(bankB, bankA, amount);
  }
  static trade(importer: Trader, exporter: Trader, amount: number) {
    const date = new Date().toISOString();
    const bill = {
      id: date,
      dueTo: exporter.id,
      dueFrom: importer.id,
      city: importer.city,
      amount: amount,
    };
    importer.liabilities.billsOfExchange = [
      ...importer.liabilities.billsOfExchange,
      bill,
    ];
    importer.goods = amount;
    exporter.assets.billsOfExchange = [
      ...exporter.assets.billsOfExchange,
      bill,
    ];
  }

  static drawBill(
    bearer: Trader,
    exchangeBank: ExchangeBank,
    presentedBill: Bill
  ) {
    if (presentedBill.dueTo === bearer.id) {
      const bill = bearer.assets.billsOfExchange.find(
        (b: Bill) => b.id === presentedBill.id
      );
      if (bill) {
        bearer.assets.billsOfExchange =
          exchangeBank.assets.billsOfExchange.filter(
            (b: Bill) => b.id !== presentedBill.id
          );

        exchangeBank.assets.billsOfExchange = [
          ...exchangeBank.assets.billsOfExchange,
          bill,
        ];
        ExchangeBankService.makeExchange(bearer, exchangeBank, bill);
      }
    }
  }

  static makeExchange(bearer: Trader, exchangeBank: ExchangeBank, bill: Bill) {
    const cityQuotesCertain: boolean = certaintyQuotes[exchangeBank.city];
    if (cityQuotesCertain) {
      exchangeBank.exchangeUnit -= bill.amount;
      bearer.reserves += bill.amount * exchangeRates[exchangeBank.city];
    } else {
      exchangeBank.reserves -= bill.amount * exchangeRates[bill.city];
      bearer.reserves += bill.amount * exchangeRates[bill.city];
    }
  }

  static remitBill(
    presenter: ExchangeBank,
    presentee: ExchangeBank,
    presentedBill: Bill
  ) {
    const bill = presenter.assets.billsOfExchange.find(
      (b: Bill) => b.id === presentedBill.id
    );

    if (bill) {
      presenter.assets.billsOfExchange =
        presenter.assets.billsOfExchange.filter(
          (b: Bill) => b.id !== presentedBill.id
        );
      presentee.assets.billsOfExchange = [
        ...presentee.assets.billsOfExchange,
        bill,
      ];
    }
  }

  static presentBill(exchangeBank: ExchangeBank, payee: Trader, presentedBill: Bill) {
    const bill = exchangeBank.assets.find((b: Bill) => b.id === presentedBill.id);
    if (presentedBill.dueFrom === payee.id) {
      exchangeBank.assets = exchangeBank.assets.filter(
        (b: Bill) => b.id !== presentedBill.id
      );
      payee.liabilities = payee.liabilities.filter(
        (b: Bill) => b.id !== presentedBill.id
      );
      const cityQuotesCertain = certaintyQuotes[exchangeBank.city];
      if (cityQuotesCertain) {
        exchangeBank.exchangeUnit += bill.amount;
        payee.reserves -= bill.amount * exchangeRates[exchangeBank.city];
      } else {
        exchangeBank.reserves += bill.amount * exchangeRates[bill.city];
        payee.reserves -= bill.amount * exchangeRates[bill.city];
      }
    }
  }
}

export class TradeService {
  static trade(importer: Trader, exporter: Trader, amount: number) {
    importer.goods += amount;
    exporter.goods -= amount;
  }
}
