import "@testing-library/jest-dom";
import { System } from "../systems";

import { Customer, CommercialBank, ClearingHouse } from "../instances";
import {
  CustomerService,
  BankService,
  ClearingHouseService,
} from "../services";

function createBanksAndCustomers() {
  System.setSystem();
  const bank1 = new CommercialBank("Bank1");
  const bank2 = new CommercialBank("Bank2");
  const customer1 = new Customer("CUSTOMER1");
  const customer2 = new Customer("CUSTOMER2");
  return { bank1, bank2, customer1, customer2 };
}
function clearinghousePlusCertificates() {
  System.setSystem("clearinghouse");
  const clearinghouse = new ClearingHouse("clearinghouse");
  const bank1 = new CommercialBank("Bank1");
  const bank2 = new CommercialBank("Bank2");
  const customer1 = new Customer("CUSTOMER1");
  const customer2 = new Customer("CUSTOMER2");
  ClearingHouseService.openAccount(bank1, clearinghouse, 1000);
  ClearingHouseService.openAccount(bank2, clearinghouse, 1000);
  return { clearinghouse, bank1, bank2, customer1, customer2 };
}

describe("credit checks", () => {
  it("customer inOverdraft is false if customer is in credit", () => {
    const { bank1, customer1, customer2 } = createBanksAndCustomers();
    CustomerService.openAccount(customer1, bank1);
    CustomerService.openAccount(customer2, bank1);
    CustomerService.deposit(customer1, bank1, 100);
    expect(customer1.inOverdraft()).toBe(false);
  });
  it("customer inOverdraft is true if customer is in overdraft", () => {
    const { bank1, customer1, customer2 } = createBanksAndCustomers();
    CustomerService.openAccount(customer1, bank1);
    CustomerService.openAccount(customer2, bank1);
    CustomerService.withdraw(customer1, bank1, 100);
    expect(customer1.inOverdraft()).toBe(true);
  });
  // describe("each customer has same bank", () => {
  //   it("creates an account accessible to both customer and bank on openAccount", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     expect(customer1.balances.customerDeposits.length).toBe(1);
  //     expect(customer2.balances.customerDeposits.length).toBe(1);
  //     expect(bank1.balances.customerDeposits.length).toBe(2);
  //   });
  //   it("creates an account in customer with a bank id on openAccount", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     expect(customer1.balances.customerDeposits[0].id).toBe(`${customer1.id}-${bank1.id}`);
  //     expect(customer2.balances.customerDeposits[0].id).toBe(`${customer2.id}-${bank1.id}`);
  //   });
  //   it("creates an account in bank with an ordered set id on openAccount", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     expect(bank1.balances.customerDeposits[0].id).toBe(`${customer1.id}-${bank1.id}`);
  //     expect(bank1.balances.customerDeposits[1].id).toBe(`${customer2.id}-${bank1.id}`);
  //   });
  //   it("decreases customer1 balance on transfer", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     CustomerService.transfer(customer1, customer2, 50);

  //     expect(customer1.balances.customerDeposits[0].amount).toBe(-50);
  //     expect(customer2.balances.customerDeposits[0].amount).toBe(50);
  //   });
  //   it("decrease customer1 assets on transfer", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(customer1.assets.customerDeposits[0].amount).toBe(50);
  //     expect(customer2.assets.customerDeposits[0].amount).toBe(50);
  //   });
  //   it("increase customer1 liabilities on transfer with no deposits in account", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(customer1.liabilities.customerOverdrafts[0].amount).toBe(50);
  //   });
  //   it("decrease bank1 liabilities to customer1 on transfer", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     expect(bank1.liabilities.customerDeposits[0].amount).toBe(100);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(bank1.liabilities.customerDeposits[0].amount).toBe(50);
  //   });
  //   it("increase bank1 liabilities to customer2 on transfer", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     expect(bank1.liabilities.customerDeposits[1].amount).toBe(0);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(bank1.liabilities.customerDeposits[1].amount).toBe(50);
  //   });
  //   it("bank maintains same amount of overall liabilities on transfer", () => {
  //     const { bank1, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank1);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     const initialTotal = bank1.liabilities.customerDeposits.reduce(
  //       (a, b) => {
  //         return { amount: a.amount + b.amount };
  //       },
  //       { amount: 0 }
  //     );
  //     expect(initialTotal.amount).toBe(100);
  //     CustomerService.transfer(
  //       customer1,
  //       customer2,
  //       Math.floor(Math.random() * 100)
  //     );
  //     const newTotal = bank1.liabilities.customerDeposits.reduce(
  //       (a, b) => {
  //         return { amount: a.amount + b.amount };
  //       },
  //       { amount: 0 }
  //     );
  //     expect(newTotal.amount).toBe(100);
  //   });
  // });
  // describe("each customer has different bank", () => {
  //   it("creates an account accessible to both customer and bank on openAccount", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     expect(customer1.balances.customerDeposits.length).toBe(1);
  //     expect(customer2.balances.customerDeposits.length).toBe(1);
  //     expect(bank1.balances.customerDeposits.length).toBe(1);
  //     expect(bank2.balances.customerDeposits.length).toBe(1);
  //   });
  //   it("creates an account in customer with ordered-set id (bank-customer) on openAccount", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     expect(customer1.balances.customerDeposits[0].id).toBe(`${customer1.id}-${bank1.id}`);
  //     expect(customer2.balances.customerDeposits[0].id).toBe(`${customer2.id}-${bank2.id}`);
  //   });
  //   it("creates an account in bank with ordered-set id (bank-customer) on openAccount", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     expect(bank1.balances.customerDeposits[0].id).toBe(`${customer1.id}-${bank1.id}`);
  //     expect(bank2.balances.customerDeposits[0].id).toBe(`${customer2.id}-${bank2.id}`);
  //   });
  //   it("decrease customer1 balance on transfer", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     BankService.openAccount(bank1, bank2);
  //     BankService.openAccount(bank2, bank1);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(customer1.balances.customerDeposits[0].amount).toBe(-50);
  //     expect(customer2.balances.customerDeposits[0].amount).toBe(50);
  //   });
  //   it("decrease customer1 assets on transfer", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(customer1.assets.customerDeposits[0].amount).toBe(50);
  //     expect(customer2.assets.customerDeposits[0].amount).toBe(50);
  //   });
  //   it("increase customer1 liabilities on transfer with no deposits in account", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(customer1.liabilities.customerOverdrafts[0].amount).toBe(50);
  //   });
  //   it("decrease bank1 liabilities to customer1 on transfer", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     expect(bank1.liabilities.customerDeposits[0].amount).toBe(100);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(bank1.liabilities.customerDeposits[0].amount).toBe(50);
  //   });
  //   it("increase bank2 liabilities to customer2 on transfer", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     expect(bank2.liabilities.customerDeposits[0].amount).toBe(0);
  //     CustomerService.transfer(customer1, customer2, 50);
  //     expect(bank2.liabilities.customerDeposits[0].amount).toBe(50);
  //   });
  //   it("bank does not maintain same amount of overall liabilities on transfer", () => {
  //     const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
  //     CustomerService.openAccount(customer1, bank1);
  //     CustomerService.openAccount(customer2, bank2);
  //     CustomerService.deposit(customer1, bank1, 100);
  //     const initialTotal = bank1.liabilities.customerDeposits.reduce(
  //       (a, b) => {
  //         return { amount: a.amount + b.amount };
  //       },
  //       { amount: 0 }
  //     );
  //     expect(initialTotal.amount).toBe(100);
  //     CustomerService.transfer(
  //       customer1,
  //       customer2,
  //       Math.floor(Math.random() * 100)
  //     );
  //     const newTotal = bank1.liabilities.customerDeposits.reduce(
  //       (a, b) => {
  //         return { amount: a.amount + b.amount };
  //       },
  //       { amount: 0 }
  //     );
  //     expect(newTotal.amount).not.toBe(100);
  //   });
  // });
});
describe("records", () => {
  it("tracks record of deposit transaction", () => {
    const { bank1, customer1, customer2 } = createBanksAndCustomers();
    CustomerService.openAccount(customer1, bank1);
    CustomerService.openAccount(customer2, bank1);
    CustomerService.withdraw(customer1, bank1, 100);
    expect(customer1.inOverdraft()).toBe(true);
  });
  it("continuous debtor status should be true if bank has been a debtor continuously for number of most recent times specified", () => {
    System.setSystem("clearinghouse");
    const { bank1, bank2, customer1, customer2 } =
      clearinghousePlusCertificates();
    CustomerService.openAccount(customer1, bank1);
    CustomerService.openAccount(customer2, bank2);
    CustomerService.deposit(customer1, bank1, 100);
    CustomerService.deposit(customer2, bank2, 100);
    CustomerService.transfer(customer1, customer2, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    CustomerService.transfer(customer1, customer2, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    CustomerService.transfer(customer1, customer2, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    // CustomerService.transfer(customer2, customer1, 50);
    // BankService.netDues(bank1);
    // BankService.netDues(bank2);
    // ClearingHouseService.settleDues();
    // CustomerService.transfer(customer2, customer1, 50);
    // BankService.netDues(bank1);
    // BankService.netDues(bank2);
    // ClearingHouseService.settleDues();

    expect(bank1.isConstantDebtor(3)).toBe(true);
  });
  it("continuous debtor status should be false if bank has not been a debtor continuously for number of most recent times specified", () => {
    System.setSystem("clearinghouse");
    const { bank1, bank2, customer1, customer2 } =
      clearinghousePlusCertificates();
    CustomerService.openAccount(customer1, bank1);
    CustomerService.openAccount(customer2, bank2);
    CustomerService.deposit(customer1, bank1, 100);
    CustomerService.deposit(customer2, bank2, 100);
    CustomerService.transfer(customer1, customer2, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    CustomerService.transfer(customer1, customer2, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    CustomerService.transfer(customer1, customer2, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    CustomerService.transfer(customer2, customer1, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    CustomerService.transfer(customer2, customer1, 50);
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    ClearingHouseService.settleDues();
    expect(bank1.isConstantDebtor(3)).toBe(false);
  });
});
