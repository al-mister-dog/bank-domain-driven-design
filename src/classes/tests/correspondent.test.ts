import "@testing-library/jest-dom";
import { CommercialBank, Bank } from "../classes";
import { createCorrespondentBanks } from "./testFixtures";

describe("correspondent banking 2", () => {
  it("should open corresponding accounts with correct ids and amounts", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    expect(hsbc.assets.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(hsbc.liabilities.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(barclays.assets.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(barclays.liabilities.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(barclays.balances.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
  });
  it("should display correct account amounts on credit transfer of bank deposits", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CommercialBank.creditAccount(hsbc, barclays, 150);
    expect(hsbc.assets.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1150,
    });
    expect(hsbc.liabilities.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(barclays.assets.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(barclays.liabilities.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1150,
    });
  });
  it("should display correct account amounts on debit transfer of bank deposits", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CommercialBank.debitAccount(hsbc, barclays, 150);
    expect(hsbc.assets.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 850,
    });
    expect(hsbc.liabilities.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(barclays.assets.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(barclays.liabilities.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 850,
    });
  });

  it("should display correct account amounts on credit transfer of bank deposits2", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CommercialBank.creditAccount(hsbc, barclays, 150);
    expect(hsbc.assets.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1150,
    });
    expect(hsbc.liabilities.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(barclays.assets.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(barclays.liabilities.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1150,
    });
  });
  it("should display correct account amounts on credit transfer of bank deposits from b1 to b2", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CommercialBank.creditAccount(barclays, hsbc, 150);
    expect(barclays.assets.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1150,
    });
    expect(barclays.liabilities.bankDeposits[0]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(hsbc.assets.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(hsbc.liabilities.bankDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 1150,
    });
  });

  it("should display correct deposit accounts", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(hsbc, barclays, 1000,"bankDeposits",
    "bankOverdrafts");
    CommercialBank.creditAccount(hsbc, barclays, 100);
    expect(hsbc.assets.bankDeposits[0].amount).toBe(1100)
    expect(hsbc.liabilities.bankDeposits[0].amount).toBe(1000)
    expect(hsbc.assets.bankOverdrafts[0].amount).toBe(0)
    expect(hsbc.liabilities.bankOverdrafts[0].amount).toBe(0)
    expect(barclays.assets.bankDeposits[0].amount).toBe(1000)
    expect(barclays.liabilities.bankDeposits[0].amount).toBe(1100)
    expect(barclays.assets.bankOverdrafts[0].amount).toBe(0)
    expect(barclays.liabilities.bankOverdrafts[0].amount).toBe(0)
  });
  it("should display correct overdraft accounts", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits",
    "bankOverdrafts");
    CommercialBank.debitAccount(hsbc, barclays, 1100);
    expect(hsbc.assets.bankDeposits[0].amount).toBe(0)
    expect(hsbc.liabilities.bankDeposits[0].amount).toBe(1000)
    expect(hsbc.assets.bankOverdrafts[0].amount).toBe(0)
    expect(hsbc.liabilities.bankOverdrafts[0].amount).toBe(100)
    expect(barclays.assets.bankDeposits[0].amount).toBe(1000)
    expect(barclays.liabilities.bankDeposits[0].amount).toBe(0)
    expect(barclays.assets.bankOverdrafts[0].amount).toBe(100)
    expect(barclays.liabilities.bankOverdrafts[0].amount).toBe(0)
  });
  it("should display correct zero balance accounts", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    Bank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits",
    "bankOverdrafts");
    CommercialBank.debitAccount(hsbc, barclays, 1000);
    expect(hsbc.assets.bankDeposits[0].amount).toBe(0)
    expect(hsbc.liabilities.bankDeposits[0].amount).toBe(1000)
    expect(hsbc.assets.bankOverdrafts[0].amount).toBe(0)
    expect(hsbc.liabilities.bankOverdrafts[0].amount).toBe(0)
    expect(barclays.assets.bankDeposits[0].amount).toBe(1000)
    expect(barclays.liabilities.bankDeposits[0].amount).toBe(0)
    expect(barclays.assets.bankOverdrafts[0].amount).toBe(0)
    expect(barclays.liabilities.bankOverdrafts[0].amount).toBe(0)
  });
});
