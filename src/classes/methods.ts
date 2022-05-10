import { Bank } from "./instances";
import { SystemMethods } from "./systems";
import { InstrumentKey } from "./types";

export class PaymentMethods {
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
    PaymentMethods.mapBalance(
      a,
      b,
      creditInstrument,
      debtInstrument,
      aAccount.balance
    );
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
    PaymentMethods.mapBalance(
      a,
      b,
      creditInstrument,
      debtInstrument,
      aAccount.balance
    );
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

  static settleDues() {
    SystemMethods.settleDues();
  }

  static clearDues(a: Bank, b: Bank) {
    a.setAccount(b.id, "assets", "dues", 0);
    a.setAccount(b.id, "liabilities", "dues", 0);
  }
}

export class AccountMethods {
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
    AccountMethods.createAccount(a, b, creditInstrument);
  }
}
