import "@testing-library/jest-dom";
import { Customer, CommercialBank, ClearingHouse } from "../instances";
import {
  CustomerService,
  CommercialBankService,
  PaymentMethods,
} from "../static-methods";
import { System, systemCheck } from "../banking-system-methods";

function createBanksAndCustomers() {
  System.setSystem("clearinghouse");
  const clearinghouse = new ClearingHouse("clearinghouse");
  const bank1 = new CommercialBank("Bank1");
  const bank2 = new CommercialBank("Bank2");
  const customer1 = new Customer("CUSTOMER1");
  const customer2 = new Customer("CUSTOMER2");
  return { clearinghouse, bank1, bank2, customer1, customer2 };
}

describe("set up clearing house system", () => {
  it("sets system to clearing house banking", () => {
    createBanksAndCustomers();
    expect(systemCheck).toBe("clearinghouse");
  });
});
describe("balance sheet accounting", () => {
  describe("each customer has different bank", () => {
    it("creates an account accessible to both customer and bank on openAccount", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      expect(customer1.accounts.length).toBe(1);
      expect(customer2.accounts.length).toBe(1);
      expect(bank1.accounts.length).toBe(4);
      expect(bank2.accounts.length).toBe(4);
      expect(bank1.accounts.map((account) => account.id)).toEqual([
        `${bank1.id}-${clearinghouse.id}`,
        `${customer1.id}-${bank1.id}`,
        `${bank1.id}-${bank2.id}`,
        `${bank2.id}-${bank1.id}`,
      ]);
    });
    it("increases bank1 liabilities dues to customer1 on transfer", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.transfer(customer1, customer2, 50);
      expect(bank1.liabilities.dues[0]).toEqual({
        id: clearinghouse.id,
        type: "dues",
        amount: 50,
      });
    });
    it("increase bank2 assets dues to customer2 on transfer", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.transfer(customer1, customer2, 50);
      expect(bank2.assets.dues[0]).toEqual({
        id: clearinghouse.id,
        type: "dues",
        amount: 50,
      });
    });
    it("accumulates dues", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      expect(bank1.liabilities.dues[0].amount).toBe(30);
      expect(bank2.liabilities.dues[0].amount).toBe(70);
      expect(bank1.assets.dues[0].amount).toBe(70);
      expect(bank2.assets.dues[0].amount).toBe(30);
    });
    it("nets banks' dues", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      expect(bank1.liabilities.dues[0].amount).toBe(0);
      expect(bank1.assets.dues[0].amount).toBe(40);
      expect(bank2.liabilities.dues[0].amount).toBe(40);
      expect(bank2.assets.dues[0].amount).toBe(0);
    });
    it("nets clearinghouse's dues", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
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
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      PaymentMethods.settleDues();
      expect(bank1.assets.chCertificates[0].amount).toBe(40);
      expect(bank1.accounts[0].balance).toBe(40);
    });
    it("increases bank2 liabilities and balance in account with clearinghouse", () => {
      const { bank1, bank2, customer1, customer2 } = createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      PaymentMethods.settleDues();
      expect(bank2.liabilities.chOverdrafts[0].amount).toBe(40);
      expect(bank2.accounts[0].balance).toBe(-40);
    });
    it("increases clearinghouse liabilities and balance in account with bank1", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      PaymentMethods.settleDues();
      expect(clearinghouse.liabilities.chCertificates[0].amount).toBe(40);
      expect(clearinghouse.accounts[0].balance).toBe(40);
    });
    it("increases clearinghouse assets and balance in account with bank2", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      PaymentMethods.settleDues();
      expect(clearinghouse.assets.chOverdrafts[1].amount).toBe(40);
      expect(clearinghouse.accounts[1].balance).toBe(-40);
    });
    it("aincreases clearinghouse assets and balance in account with bank2", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CommercialBankService.openAccount(bank1, bank2);
      CommercialBankService.openAccount(bank2, bank1);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      PaymentMethods.settleDues();
      expect(clearinghouse.assets.chOverdrafts[1].amount).toBe(40);
      expect(clearinghouse.accounts[1].balance).toBe(-40);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      PaymentMethods.settleDues();
      expect(clearinghouse.assets.chOverdrafts[1].amount).toBe(80);
      expect(clearinghouse.accounts[1].balance).toBe(-80);
    });
    it("nets dues in banking service", () => {
      const { clearinghouse, bank1, bank2, customer1, customer2 } =
        createBanksAndCustomers();
      CustomerService.openAccount(customer1, bank1);
      CustomerService.openAccount(customer2, bank2);
      CustomerService.deposit(customer1, bank1, 100);
      CustomerService.deposit(customer2, bank2, 100);
      CustomerService.transfer(customer1, customer2, 10);
      CustomerService.transfer(customer1, customer2, 20);
      CustomerService.transfer(customer2, customer1, 30);
      CustomerService.transfer(customer2, customer1, 40);
      CommercialBankService.netDues(bank1);
      CommercialBankService.netDues(bank2);
      PaymentMethods.settleDues();
    });
  });
});
