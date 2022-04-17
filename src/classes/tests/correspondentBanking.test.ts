import "@testing-library/jest-dom";
import { CorrespondentBank } from "../classes";
import { createBanks } from "./fixtures";

describe("correspondent banking", () => {
  it("should open corresponding accounts with correct ids and amounts", () => {
    const {hsbc, barclays} = createBanks()
    CorrespondentBank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits");
    expect(hsbc.assets.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(hsbc.liabilities.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(barclays.assets.bankDeposits[1]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(barclays.liabilities.bankDeposits[1]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
  });
  it("should display correct account amounts on credit transfer of bank deposits", () => {
    const {hsbc, barclays} = createBanks()
    CorrespondentBank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits");
    CorrespondentBank.creditAccount(hsbc, barclays, 150, "bankDeposits");
    expect(hsbc.assets.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 1150 } )
    expect(hsbc.liabilities.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 1000 } )
    expect(barclays.assets.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 1000 } )
    expect(barclays.liabilities.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 1150 } )
  });
  it("should display correct account amounts on debit transfer of bank deposits", () => {
    const {hsbc, barclays} = createBanks()
    CorrespondentBank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits");
    CorrespondentBank.debitAccount(hsbc, barclays, 150, "bankDeposits");
    expect(hsbc.assets.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 1000 } )
    expect(hsbc.liabilities.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 850 } )
    expect(barclays.assets.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 850 } )
    expect(barclays.liabilities.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 1000 } )
  });
});
