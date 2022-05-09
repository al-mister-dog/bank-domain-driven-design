import "@testing-library/jest-dom";

import { CommercialBank } from "../classes2";
import { commercialAssets, commercialLiabilities, balances } from "../fixtures";
function createBankAndCustomer() {
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
  return { bank1, bank2 };
}
describe("balance sheet accounting", () => {
  describe("account balance", () => {
    it("creates an account accessible to both bank1 and bank on openAccount", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      expect(bank2.accounts.length).toBe(1);
      expect(bank1.accounts.length).toBe(1);
    });
    it("creates an account in bank1 with a bank id on openAccount", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      expect(bank2.accounts[0].id).toBe(`${bank2.id}-${bank1.id}`);
    });
    it("creates an account in bank with a bank1 id on openAccount", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      expect(bank1.accounts[0].id).toBe(`${bank2.id}-${bank1.id}`);
    });
    it("adds to bank1 account balance on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank2.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: 100,
      });
    });
    it("adds to bank account balance on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank1.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: 100,
      });
    });
    it("accumulates a balance", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      const depositAmount = 100;
      const depositActions = 5;
      for (let i = 0; i < depositActions; i++) {
        CommercialBank.deposit(bank2, bank1, depositAmount);
      }
      expect(bank1.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: depositAmount * depositActions,
      });
      expect(bank2.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: depositAmount * depositActions,
      });
    });
    it("subtracts from bank1 account on customerWithdraw", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank2.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: -100,
      });
    });
    it("subtract from bank account on customerWithdraw", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank1.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: -100,
      });
    });
    it("decreases a balance", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      const depositAmount = 100;
      const depositActions = 5;
      for (let i = 0; i < depositActions; i++) {
        CommercialBank.withdraw(bank2, bank1, depositAmount);
      }
      expect(bank1.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: -(depositAmount * depositActions),
      });
      expect(bank2.accounts[0]).toEqual({
        id: `${bank2.id}-${bank1.id}`,
        type: "bankDeposits",
        balance: -(depositAmount * depositActions),
      });
    });
  });
  describe("assets and liabilities", () => {
    it("adds to bank bankDeposit liabilities on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank1.liabilities.bankDeposits[0]).toEqual({
        id: bank2.id,
        type: "bankDeposits",
        amount: 100,
      });
    });
    it("adds to bank1 bankDeposit assets on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank2.assets.bankDeposits[0]).toEqual({
        id: bank1.id,
        type: "bankDeposits",
        amount: 100,
      });
    });
    it("does not add to bank bankDeposit overdrafts on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank1.assets.bankOverdrafts[0]).toEqual({
        id: bank2.id,
        type: "bankOverdrafts",
        amount: 0,
      });
    });
    it("does not add to bank1 bankDeposit overdrafts on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank2.liabilities.bankOverdrafts[0]).toEqual({
        id: bank1.id,
        type: "bankOverdrafts",
        amount: 0,
      });
    });
    it("adds to bank bankOverdraft assets on customerWithdraw", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank1.assets.bankOverdrafts[0]).toEqual({
        id: bank2.id,
        type: "bankOverdrafts",
        amount: 100,
      });
    });
    it("adds to bank1 bankOverdraft liabilities on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank2.liabilities.bankOverdrafts[0]).toEqual({
        id: bank1.id,
        type: "bankOverdrafts",
        amount: 100,
      });
    });
    it("does not add to bank bankDeposit liabilities on customerWithdraw", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank1.liabilities.bankDeposits[0]).toEqual({
        id: bank2.id,
        type: "bankDeposits",
        amount: 0,
      });
    });
    it("does not add to bank1 bankDeposit assets on customerWithdraw", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank2.assets.bankDeposits[0]).toEqual({
        id: bank1.id,
        type: "bankDeposits",
        amount: 0,
      });
    });
    it("can go from overdraft to credit account and map to balance", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank2.accounts[0].balance).toBe(100);
      expect(bank1.accounts[0].balance).toBe(100);
      expect(bank2.assets.bankDeposits[0].amount).toBe(100);
      expect(bank1.liabilities.bankDeposits[0].amount).toBe(100);
      expect(bank2.liabilities.bankOverdrafts[0].amount).toBe(0);
      expect(bank1.assets.bankOverdrafts[0].amount).toBe(0);
      CommercialBank.withdraw(bank2, bank1, 200);
      expect(bank2.accounts[0].balance).toBe(-100);
      expect(bank1.accounts[0].balance).toBe(-100);
      expect(bank2.assets.bankDeposits[0].amount).toBe(0);
      expect(bank1.liabilities.bankDeposits[0].amount).toBe(0);
      expect(bank2.liabilities.bankOverdrafts[0].amount).toBe(100);
      expect(bank1.assets.bankOverdrafts[0].amount).toBe(100);
      CommercialBank.deposit(bank2, bank1, 200);
      expect(bank2.accounts[0].balance).toBe(100);
      expect(bank1.accounts[0].balance).toBe(100);
      expect(bank2.assets.bankDeposits[0].amount).toBe(100);
      expect(bank1.liabilities.bankDeposits[0].amount).toBe(100);
      expect(bank2.liabilities.bankOverdrafts[0].amount).toBe(0);
      expect(bank1.assets.bankOverdrafts[0].amount).toBe(0);
    });
  });
  describe("reserves", () => {
    it("should decrease bank1 reserves on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      bank2.reserves = 100
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank2.reserves).toBe(0)
    })
    it("should increase bank reserves on bankDeposit", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      bank2.reserves = 100
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.deposit(bank2, bank1, 100);
      expect(bank1.reserves).toBe(100)
    })
    it("should increase bank1 reserves on customerWithdraw", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      bank2.reserves = 0
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank2.reserves).toBe(100)
    })
    it("should decrease bank reserves on customerWithdraw", () => {
      const { bank1, bank2 } = createBankAndCustomer();
      bank1.reserves = 100
      CommercialBank.openAccount(bank2, bank1);
      CommercialBank.withdraw(bank2, bank1, 100);
      expect(bank1.reserves).toBe(0)
    })
  })
});

describe("deposit payments", () => {
  it("maps increase in balance of bank1. adds to bank1 assets. adds to bank2 liabilities", () => {
    const { bank1, bank2 } = createBankAndCustomer();
    CommercialBank.openAccount(bank1, bank2);
    CommercialBank.creditAccount(bank1, bank2, 100);
    expect(bank1.accounts[0]).toEqual({
      id: `${bank1.id}-${bank2.id}`,
      type: "bankDeposits",
      balance: 100,
    });
    expect(bank1.assets.bankDeposits[0]).toEqual({
      id: bank2.id,
      type: "bankDeposits",
      amount: 100,
    });
    expect(bank2.liabilities.bankDeposits[0]).toEqual({
      id: bank1.id,
      type: "bankDeposits",
      amount: 100,
    });
  });
  it("maps decrease in balance of bank1. adds to bank1 liabilities. adds to bank2 assets", () => {
    const { bank1, bank2 } = createBankAndCustomer();
    CommercialBank.openAccount(bank1, bank2);
    CommercialBank.debitAccount(bank1, bank2, 100);
    expect(bank1.accounts[0]).toEqual({
      id: `${bank1.id}-${bank2.id}`,
      type: "bankDeposits",
      balance: -100,
    });
    expect(bank1.liabilities.bankOverdrafts[0]).toEqual({
      id: bank2.id,
      type: "bankOverdrafts",
      amount: 100,
    });
    expect(bank2.assets.bankOverdrafts[0]).toEqual({
      id: bank1.id,
      type: "bankOverdrafts",
      amount: 100,
    });
  });
})

//NEXT
//if bank1 credits bank2 account:
//bank1 bankDeposit liabilities to bank2 increases
//bank2 bankDeposit assets from bank1 increases