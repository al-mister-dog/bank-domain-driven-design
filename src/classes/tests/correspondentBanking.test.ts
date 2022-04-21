import "@testing-library/jest-dom";
import { CorrespondentBank } from "../classes2";
import { createCorrespondentBanks } from "./fixtures2";

// describe("correspondent banking", () => {
//   it("should open corresponding accounts with correct ids and amounts", () => {
//     const {hsbc, barclays} = createCorrespondentBanks()
//     CorrespondentBank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits");
//     expect(hsbc.assets.bankDeposits[1]).toEqual({
//       id: "BARCLAYS",
//       amount: 1000,
//     });
//     expect(hsbc.liabilities.bankDeposits[1]).toEqual({
//       id: "BARCLAYS",
//       amount: 1000,
//     });
//     expect(barclays.assets.bankDeposits[1]).toEqual({ƒ
//       id: "HSBC",
//       amount: 1000,
//     });
//     expect(barclays.liabilities.bankDeposits[1]).toEqual({
//       id: "HSBC",
//       amount: 1000,
//     });
//   });
//   it("should display correct account amounts on credit transfer of bank deposits", () => {
//     const {hsbc, barclays} = createCorrespondentBanks()
//     CorrespondentBank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits");
//     CorrespondentBank.creditAccount(hsbc, barclays, 150, "bankDeposits");
//     expect(hsbc.assets.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 1150 } )
//     expect(hsbc.liabilities.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 1000 } )
//     expect(barclays.assets.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 1000 } )
//     expect(barclays.liabilities.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 1150 } )
//   });
//   it("should display correct account amounts on debit transfer of bank deposits", () => {
//     const {hsbc, barclays} = createCorrespondentBanks()
//     CorrespondentBank.createCorrespondingAccounts(hsbc, barclays, 1000, "bankDeposits");
//     CorrespondentBank.debitAccount(hsbc, barclays, 150, "bankDeposits");
//     expect(hsbc.assets.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 1000 } )
//     expect(hsbc.liabilities.bankDeposits[1]).toEqual({ id: 'BARCLAYS', amount: 850 } )
//     expect(barclays.assets.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 850 } )
//     expect(barclays.liabilities.bankDeposits[1]).toEqual({ id: 'HSBC', amount: 1000 } )
//   });
// });

// describe("balances", () => {
//   const {hsbc, barclays} = createCorrespondentBanks()
//   CorrespondentBank.createCorrespondingAccountsTest(hsbc, barclays, 1000);
//   expect(hsbc.assets.bankDeposits[1]).toEqual({
//     id: "BARCLAYS",
//     amount: 1000,
//   });
//   expect(hsbc.liabilities.bankDeposits[1]).toEqual({
//     id: "BARCLAYS",
//     amount: 1000,
//   });
//   expect(barclays.assets.bankDeposits[1]).toEqual({
//     id: "HSBC",
//     amount: 1000,
//   });
//   expect(barclays.liabilities.bankDeposits[1]).toEqual({
//     id: "HSBC",
//     amount: 1000,
//   });
//   expect(hsbc.balances.bankDeposits[1].id).toBe("HSBCw/BARCLAYS")
//   expect(barclays.balances.bankDeposits[1].id).toBe("HSBCw/BARCLAYS")
//   expect(hsbc.balances.bankDeposits[2].id).toBe("BARCLAYSw/HSBC")
//   expect(barclays.balances.bankDeposits[2].id).toBe("BARCLAYSw/HSBC")
// })

describe("correspondent banking 2", () => {
  it("should open corresponding accounts with correct ids and amounts", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    CorrespondentBank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
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
    expect(barclays.balances.bankDeposits[1]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(hsbc.balances.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
  });
  it("should display correct account amounts on credit transfer of bank deposits", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    CorrespondentBank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CorrespondentBank.creditAccount(hsbc, barclays, 150);
    expect(hsbc.assets.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1150,
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
      amount: 1150,
    });
  });
  it("should display correct account amounts on debit transfer of bank deposits", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    CorrespondentBank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CorrespondentBank.debitAccount(hsbc, barclays, 150);
    expect(hsbc.assets.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(hsbc.liabilities.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 850,
    });
    expect(barclays.assets.bankDeposits[1]).toEqual({
      id: "HSBC",
      amount: 850,
    });
    expect(barclays.liabilities.bankDeposits[1]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
  });

  it("should display correct account amounts on credit transfer of bank deposits2", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    CorrespondentBank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CorrespondentBank.creditAccount(hsbc, barclays, 150);
    expect(hsbc.assets.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1150,
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
      amount: 1150,
    });
  });
  it("should display correct account amounts on credit transfer of bank deposits from b1 to b2", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    CorrespondentBank.createCorrespondingAccounts(
      hsbc,
      barclays,
      1000,
      "bankDeposits",
      "bankOverdrafts"
    );
    CorrespondentBank.creditAccount(barclays, hsbc, 150);
    expect(barclays.assets.bankDeposits[1]).toEqual({
      id: "HSBC",
      amount: 1150,
    });
    expect(barclays.liabilities.bankDeposits[1]).toEqual({
      id: "HSBC",
      amount: 1000,
    });
    expect(hsbc.assets.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1000,
    });
    expect(hsbc.liabilities.bankDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 1150,
    });
  });
  it("should display correct overdraft accounts", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    CorrespondentBank.createCorrespondingAccountsTest(hsbc, barclays, 1000);
    CorrespondentBank.debitAccountTest(hsbc, barclays, 1100);
    expect(hsbc.assets.bankOverdrafts[1].amount).toBe(100);
    expect(hsbc.assets.bankDeposits[1].amount).toBe(1000);
    expect(hsbc.liabilities.bankDeposits[1].amount).toBe(0);
    expect(hsbc.liabilities.bankOverdrafts[1].amount).toBe(0);
    expect(barclays.assets.bankOverdrafts[1].amount).toBe(0);
    expect(barclays.assets.bankDeposits[1].amount).toBe(0);
    expect(barclays.liabilities.bankDeposits[1].amount).toBe(1000);
    expect(barclays.liabilities.bankOverdrafts[1].amount).toBe(100);
  });
  it("should display correct deposit accounts", () => {
    const { hsbc, barclays } = createCorrespondentBanks();
    CorrespondentBank.createCorrespondingAccountsTest(hsbc, barclays, 1000);
    CorrespondentBank.creditAccountTest(hsbc, barclays, 100);
    expect(hsbc.assets.bankOverdrafts[1].amount).toBe(0);
    expect(hsbc.assets.bankDeposits[1].amount).toBe(1100);
    expect(hsbc.liabilities.bankDeposits[1].amount).toBe(1000);
    expect(hsbc.liabilities.bankOverdrafts[1].amount).toBe(0);
    expect(barclays.assets.bankOverdrafts[1].amount).toBe(0);
    expect(barclays.assets.bankDeposits[1].amount).toBe(1000);
    expect(barclays.liabilities.bankDeposits[1].amount).toBe(1100);
    expect(barclays.liabilities.bankOverdrafts[1].amount).toBe(0);
  });
});
