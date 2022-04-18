import "@testing-library/jest-dom";
import { CommercialBank, Customer } from "../classes";
import { createCommercialBanks } from "./fixtures";

describe("commercial banking", () => {
  it("should make corresponding accounts on customer deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    johnDoe.cash = 150;
    expect(johnDoe.assets.customerDeposits[1]).toBe(undefined);
    expect(barclays.liabilities.customerDeposits[1]).toBe(undefined);
    Customer.makeDeposit(johnDoe, barclays, 150);
    expect(johnDoe.assets.customerDeposits[1].id).toBe("BARCLAYS");
    expect(barclays.liabilities.customerDeposits[1].id).toBe("JOHN DOE");
  });
  it("should increase bank reserves and decrease customer cash on customer deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    johnDoe.cash = 150;
    expect(johnDoe.cash).toBe(150);
    expect(barclays.reserves).toBe(0);
    Customer.makeDeposit(johnDoe, barclays, 150);
    expect(johnDoe.cash).toBe(0);
    expect(barclays.reserves).toBe(150);
  });
  it("should increase bank customer deposit liabilities and customer deposit assets on customer deposit", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    johnDoe.cash = 150;
    Customer.makeDeposit(johnDoe, barclays, 150);
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 150,
    });
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 150,
    });
  });
  it("should decrease bank reserves and increase customer cash on customer withdrawal", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    barclays.reserves = 150;
    expect(johnDoe.cash).toBe(0);
    expect(barclays.reserves).toBe(150);
    Customer.makeWithdrawal(johnDoe, barclays, 150);
    expect(johnDoe.cash).toBe(150);
    expect(barclays.reserves).toBe(0);
  });
  it("should decrease bank customer deposit liabilities and customer deposit assets on customer withdrawal", () => {
    const { barclays, johnDoe } = createCommercialBanks();
    johnDoe.assets.customerDeposits.push({ id: "BARCLAYS", amount: 150 });
    barclays.liabilities.customerDeposits.push({ id: "JOHN DOE", amount: 150 });
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 150,
    });
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 150,
    });
    Customer.makeWithdrawal(johnDoe, barclays, 150);
    expect(johnDoe.assets.customerDeposits[1]).toEqual({
      id: "BARCLAYS",
      amount: 0,
    });
    expect(barclays.liabilities.customerDeposits[1]).toEqual({
      id: "JOHN DOE",
      amount: 0,
    });
  });
});
