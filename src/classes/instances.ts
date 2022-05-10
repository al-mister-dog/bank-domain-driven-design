import {
  commercialAssets,
  commercialLiabilities,
  clearinghouseAssets,
  clearinghouseLiabilities,
} from "./fixtures";
import { SystemMethods, systemCheck } from "./system-methods";
import {
  IBank,
  Category,
  CategoryKey,
  InstrumentKey,
  Account,
  IBankLookup,
  ICustomerLookup,
} from "./types";
import { ClearingHouseService } from "./services";

export const bankLookup: IBankLookup = {};
export const customerLookup: ICustomerLookup = {};

export class Bank implements IBank {
  constructor(
    public id: string,
    public assets: Category,
    public liabilities: Category,
    public accounts: any,
    public reserves: number
  ) {}

  setAccount(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount = amount;
  }

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

  decreaseInstrument(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount -= amount;
  }
  increaseInstrument(
    id: string,
    category: CategoryKey,
    instrument: InstrumentKey,
    amount: number
  ) {
    const index = this.findAccountIndex(id, category, instrument);
    this[category][instrument][index].amount += amount;
  }

  increaseDue(id: string, category: CategoryKey, amount: number) {
    if (!this.isAccount(id, category, "dues")) {
      this.createInstrumentAccount(id, category, "dues", amount);
    } else {
      const index = this.findAccountIndex(id, category, "dues");
      this[category].dues[index].amount += amount;
    }
  }

  increaseReserves(amount: number) {
    this.reserves += amount
  }
  decreaseReserves(amount: number) {
    this.reserves -= amount
  }

  netDues() {
    SystemMethods.netDues(this);
  }
}

export class CommercialBank extends Bank {
  constructor(
    public id: string,
    public assets: Category = { ...commercialAssets },
    public liabilities: Category = { ...commercialLiabilities },
    public accounts: any[] = [],
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, accounts, reserves);
    bankLookup[id] = this;
    if (systemCheck === "clearinghouse") {
      ClearingHouseService.openAccount(this, bankLookup["clearinghouse"]);
    }
  }
}

export class Customer extends Bank {
  constructor(
    public id: string,
    public assets: Category = { customerDeposits: [] },
    public liabilities: Category = {
      customerOverdrafts: [],
      customerLoans: [],
    },
    public accounts: any[] = [],
    public reserves: number = 100
  ) {
    super(id, assets, liabilities, accounts, reserves);
    customerLookup[id] = this;
  }
}

export class ClearingHouse extends Bank {
  constructor(
    public id: string = "clearinghouse",
    public assets: Category = { ...clearinghouseAssets },
    public liabilities: Category = { ...clearinghouseLiabilities },
    public accounts: any[] = [],
    public reserves: number = 0
  ) {
    super(id, assets, liabilities, accounts, reserves);
    bankLookup["clearinghouse"] = this;
  }
}
