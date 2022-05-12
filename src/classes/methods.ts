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
    const [creditInstrument, debtInstrument] = instruments;
    const id = `${a.id}-${b.id}`;
    const account = a.balances[creditInstrument].find(
      (account: any) => account.id === id
    );
    if (account) {
      a.increaseInstrument(id, "balances", creditInstrument, amount);
      b.increaseInstrument(id, "balances", creditInstrument, amount);

      PaymentMethods.mapBalance(
        a,
        b,
        creditInstrument,
        debtInstrument,
        account.amount
      );
    }
  }

  static debitAccount(
    a: Bank,
    b: Bank,
    amount: number,
    instruments: InstrumentKey[]
  ) {
    const [creditInstrument, debtInstrument] = instruments;
    const id = `${a.id}-${b.id}`;
    const account = a.balances[creditInstrument].find(
      (account: any) => account.id === id
    );
    if (account) {
      a.decreaseInstrument(id, "balances", creditInstrument, amount);
      b.decreaseInstrument(id, "balances", creditInstrument, amount);
      PaymentMethods.mapBalance(
        a,
        b,
        creditInstrument,
        debtInstrument,
        account.amount
      );
    }
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
  static createBalance(
    a: Bank,
    b: Bank,
    amount: number = 0,
    creditInstrument: InstrumentKey
  ) {
    const id = `${a.id}-${b.id}`;
    a.createInstrument(id, "balances", creditInstrument, amount);
    b.createInstrument(id, "balances", creditInstrument, amount);
  }

  static createSubordinateAccount(
    a: Bank,
    b: Bank,
    amount: number,
    creditInstrument: InstrumentKey,
    debtInstrument: InstrumentKey
  ) {
    a.createInstrument(b.id, "assets", creditInstrument, amount);
    a.createInstrument(b.id, "liabilities", debtInstrument, 0);
    b.createInstrument(a.id, "assets", debtInstrument, 0);
    b.createInstrument(a.id, "liabilities", creditInstrument, amount);
    AccountMethods.createBalance(a, b, amount, creditInstrument);
  }
}
