import "@testing-library/jest-dom";
import { Customer } from "../classes";
import { createCommercialBanks } from "./testFixtures";

describe("balances", () => {
  it("should have correct corresponding accounts on init", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 0,
    });
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({
      id: "BARCLAYS",
      amount: 0,
    });
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0,
    });
    expect(barclays.assets.customerOverdrafts[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0,
    });
    expect(barclays.liabilities.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0,
    });
  });
  it("should have correct amount of customer deposits in balance on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(johnDoe.assets.customerDeposits[0]).toEqual({id: "BARCLAYS", amount: 100})
  });
  it("should have correct CUSTOMER deposit balance and assets on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeDeposit(johnDoe, barclays, 100);
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 100,
    });
  });
  it("should have correct BANK deposit balance and assets on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeDeposit(johnDoe, barclays, 100);
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100,
    });
    expect(barclays.liabilities.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100,
    });
  });

  it("should have CUSTOMER deposit accounts reflecting its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
  })
  it("should have BANK deposit accounts reflect its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })
    expect(barclays.liabilities.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })
  })
  it("should have CUSTOMER overdraft accounts reflect its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeWithdrawal(johnDoe, barclays, 100);
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: -100
    })
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
  })
  it("should have BANK overdraft accounts reflect its balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeWithdrawal(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: -100
    })
    expect(barclays.assets.customerOverdrafts[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })
  })

  it("should handle going from positive to negative balances", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    Customer.makeDeposit(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(barclays.liabilities.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })
    expect(barclays.assets.customerOverdrafts[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0
    })

    Customer.makeWithdrawal(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0
    })
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(barclays.liabilities.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0
    })
    expect(barclays.assets.customerOverdrafts[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0
    })

    Customer.makeWithdrawal(johnDoe, barclays, 100)
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: -100
    })
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(barclays.liabilities.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0
    })
    expect(barclays.assets.customerOverdrafts[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })

    Customer.makeDeposit(johnDoe, barclays, 200)
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })

    Customer.makeWithdrawal(johnDoe, barclays, 200)
    expect(johnDoe.assets.customerDeposits[0]).toEqual({
      id: "BARCLAYS",
      amount: 0
    })
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({
      id: "BARCLAYS",
      amount: 100
    })
    expect(barclays.balances.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: -100
    })
    expect(barclays.liabilities.customerDeposits[0]).toEqual({
      id: "JOHN_DOE",
      amount: 0
    })
    expect(barclays.assets.customerOverdrafts[0]).toEqual({
      id: "JOHN_DOE",
      amount: 100
    })
  })
});

describe("reserves", () => {
  it("should decrease customer reserves on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    johnDoe.reserves = 100
    expect(johnDoe.reserves).toBe(100)
    Customer.makeDeposit(johnDoe, barclays, 100)  
    expect(johnDoe.reserves).toBe(0)
  })
  it("should increase customer reserves on deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    johnDoe.reserves = 100
    expect(johnDoe.reserves).toBe(100)
    Customer.makeWithdrawal(johnDoe, barclays, 100)  
    expect(johnDoe.reserves).toBe(200)
  })
  it("should quit function if customer does not have enough reserves to make a deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    Customer.createSubordinateAccount(johnDoe, barclays, 0, "customerDeposits", "customerOverdrafts");
    johnDoe.reserves = 0
    Customer.makeDeposit(johnDoe, barclays, 100)  
    expect(johnDoe.assets.customerDeposits[0].amount).toBe(0)
  })
})