import "@testing-library/jest-dom";
import { Customer } from "../classes2";
import { createCommercialBanks } from "./fixtures2";

describe("balances", () => {
  it("should have correct corresponding accounts on init", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0);
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 0,
    });
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 0,
    });
    expect(johnDoe.liabilities.customerOverdrafts[1]).toEqual({
      id: "BARCLAYS",
      amount: 0,
    });
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 0,
    });
    expect(barclays.assets.customerOverdrafts[1]).toEqual({
      id: "JOHN DOE",
      amount: 0,
    });
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 0,
    });
  });
  it("should have correct amount of customer deposits in balance on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0);
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(johnDoe.assets.customerDeposits[1]).toEqual({id: "BARCLAYS", amount: 100})
  });
  it("should have correct CUSTOMER deposit balance and assets on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0);
    Customer.makeDeposit(johnDoe, barclays, 100);
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100,
    });
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100,
    });
  });
  it("should have correct BANK deposit balance and assets on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0);
    Customer.makeDeposit(johnDoe, barclays, 100);
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 100,
    });
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 100,
    });
  });
  it("should increase balance on customer deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0)
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
  })
  it("should have CUSTOMER deposit accounts reflecting its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0)
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
  })
  it("should have BANK deposit accounts reflect its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0)
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 100
    })
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 100
    })
  })
  it("should have CUSTOMER overdraft accounts reflect its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0)
    Customer.makeWithdrawal(johnDoe, barclays, 100)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: -100
    })
    expect(johnDoe.liabilities.customerOverdrafts[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
  })
  it("should have BANK overdraft accounts reflect its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0)
    Customer.makeWithdrawal(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: -100
    })
    expect(barclays.assets.customerOverdrafts[1]).toEqual({
      id: "JOHN DOE",
      amount: 100
    })
  })

  it("should handle going from positive to negative balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createCorrespondingAccounts(johnDoe, barclays, 0)
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(johnDoe.liabilities.customerOverdrafts[1]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 100
    })
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 100
    })
    expect(barclays.assets.customerOverdrafts[1]).toEqual({
      id: "JOHN DOE",
      amount: 0
    })

    Customer.makeWithdrawal(johnDoe, barclays, 100)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(johnDoe.liabilities.customerOverdrafts[1]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 0
    })
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 0
    })
    expect(barclays.assets.customerOverdrafts[1]).toEqual({
      id: "JOHN DOE",
      amount: 0
    })

    Customer.makeWithdrawal(johnDoe, barclays, 100)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: -100
    })
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(johnDoe.liabilities.customerOverdrafts[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: -100
    })
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 0
    })
    expect(barclays.assets.customerOverdrafts[1]).toEqual({
      id: "JOHN DOE",
      amount: 100
    })

    Customer.makeDeposit(johnDoe, barclays, 200)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(johnDoe.liabilities.customerOverdrafts[1]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })

    Customer.makeWithdrawal(johnDoe, barclays, 200)
    expect(johnDoe.balances.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: -100
    })
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(johnDoe.liabilities.customerOverdrafts[1]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(barclays.balances.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: -100
    })
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 0
    })
    expect(barclays.assets.customerOverdrafts[1]).toEqual({
      id: "JOHN DOE",
      amount: 100
    })
  })
});
