//TODOS
/**
 * if clearinghouse system, set banks and clearinghouse to have x reserves and chCertificates
 */
import "@testing-library/jest-dom";

import { Customer, CommercialBank, Bank, ClearingHouse, SystemManager } from "../classes2";
import { commercialAssets, commercialLiabilities, balances } from "../fixtures";
function createBanksAndCustomers() {
  SystemManager.setSystem("clearinghouse")
  Bank.setBankingSystem("clearinghouse");
  const clearinghouse = new ClearingHouse(
    "clearinghouse",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    [],
    0
  );
  const bank1 = new CommercialBank(
    "Bank1",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    [],
    0
  );
  const bank2 = new CommercialBank(
    "Bank2",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    [],
    0
  );
  const customer1 = new Customer(
    "CUSTOMER1",
    { customerDeposits: [] },
    { customerOverdrafts: [], customerLoans: [] },
    { ...balances },
    []
  );
  const customer2 = new Customer(
    "CUSTOMER2",
    { customerDeposits: [] },
    { customerOverdrafts: [], customerLoans: [] },
    { ...balances },
    []
  );
  return { clearinghouse, bank1, bank2, customer1, customer2 };
}
describe("set up correspondent system", () => {
  it("sets system to correspondent banking", () => {
    createBanksAndCustomers();
    const system = Bank.getBankingSystem();
    expect(system.clearinghouse).toBe(true);
  });
});
describe("balance sheet accounting", () => {
  describe("each customer has different bank", () => {
    it("creates an account accessible to both customer and bank on openAccount", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      expect(customer1.accounts.length).toBe(1);
      expect(customer2.accounts.length).toBe(1);
      expect(bank1.accounts.length).toBe(4);
      expect(bank2.accounts.length).toBe(4);
    });
    it("increase bank1 liabilities dues to customer1 on transfer", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.transfer(customer1, customer2, 50);
      expect(bank1.liabilities.dues[0]).toEqual({
        id: clearinghouse.id,
        type: "dues",
        amount: 50,
      });
    });
    it("increase bank2 assets dues to customer2 on transfer", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.transfer(customer1, customer2, 50);
      expect(bank2.assets.dues[0]).toEqual({
        id: clearinghouse.id,
        type: "dues",
        amount: 50,
      });
    });
    it("accumulates dues", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      expect(bank1.liabilities.dues[0].amount).toBe(30);
      expect(bank2.liabilities.dues[0].amount).toBe(70);
      expect(bank1.assets.dues[0].amount).toBe(70);
      expect(bank2.assets.dues[0].amount).toBe(30);
    });
    it("nets banks' dues", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      expect(bank1.liabilities.dues[0].amount).toBe(0);
      expect(bank1.assets.dues[0].amount).toBe(40);
      expect(bank2.liabilities.dues[0].amount).toBe(40);
      expect(bank2.assets.dues[0].amount).toBe(0);
    });
    it("nets clearinghouse's dues", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      expect(clearinghouse.liabilities.dues[0]).toEqual({
        id: bank2.id,
        type: "dues",
        amount: 0,
      });
      expect(clearinghouse.liabilities.dues[1]).toEqual({
        id: bank1.id,
        type: "dues",
        amount: 40,
      });
      expect(clearinghouse.assets.dues[0]).toEqual({
        id: bank1.id,
        type: "dues",
        amount: 0,
      });
      expect(clearinghouse.assets.dues[1]).toEqual({
        id: bank2.id,
        type: "dues",
        amount: 40,
      });
    });
    it("increases bank1 assets and balance in account with clearinghouse", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      // CommercialBank.openAccount(bank1, bank2);
      // CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      Bank.newSettleDues();
      expect(bank1.assets.chCertificates[0].amount).toBe(40);
      expect(bank1.accounts[0].balance).toBe(40);
    });
    it("increases bank2 liabilities and balance in account with clearinghouse", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      Bank.newSettleDues();
      expect(bank2.liabilities.chOverdrafts[0].amount).toBe(40);
      console.log(bank2.accounts)
      expect(bank2.accounts[0].balance).toBe(-40);
    });
    it("increases clearinghouse liabilities and balance in account with bank1", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      Bank.newSettleDues();
      expect(clearinghouse.liabilities.chCertificates[0].amount).toBe(40);
      expect(clearinghouse.accounts[0].balance).toBe(40);
    });
    it("increases clearinghouse assets and balance in account with bank2", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      Bank.newSettleDues();
      expect(clearinghouse.assets.chOverdrafts[1].amount).toBe(40);
      expect(clearinghouse.accounts[1].balance).toBe(-40);
    });
    it("aincreases clearinghouse assets and balance in account with bank2", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      Customer.openAccount(customer1, bank1);
      Customer.openAccount(customer2, bank2);
      CommercialBank.openAccount(bank1, bank2);
      CommercialBank.openAccount(bank2, bank1);
      Customer.deposit(customer1, bank1, 100);
      Customer.deposit(customer2, bank2, 100);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      Bank.newSettleDues();
      expect(clearinghouse.assets.chOverdrafts[1].amount).toBe(40);
      expect(clearinghouse.accounts[1].balance).toBe(-40);
      Customer.transfer(customer1, customer2, 10);
      Customer.transfer(customer1, customer2, 20);
      Customer.transfer(customer2, customer1, 30);
      Customer.transfer(customer2, customer1, 40);
      bank1.netDues();
      bank2.netDues();
      Bank.newSettleDues();
      expect(clearinghouse.assets.chOverdrafts[1].amount).toBe(80);
      expect(clearinghouse.accounts[1].balance).toBe(-80);
    });
  });
});
