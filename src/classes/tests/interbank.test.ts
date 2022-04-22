//TODO: WORK ON GIVE DETAILS/ SHARE DETAILS
import "@testing-library/jest-dom";
import { error } from "console";
import { Bank, Customer } from "../classes";
import { createInterBank } from "./testFixtures";

describe("transfers within one bank", () => {
  it("should create two customer accounts", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    expect(johnDoe.assets.customerDeposits[1].id).toBe("BARCLAYS");
    expect(janeDoe.assets.customerDeposits[1].id).toBe("BARCLAYS");
    expect(barclays.balances.customerDeposits[1].id).toBe("JOHN_DOE");
    expect(barclays.balances.customerDeposits[2].id).toBe("JANE_DOE");
  });
  it("should decrease customer1 deposits and increase customer2 deposits on transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(50);
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(150);
  });
  it("should decrease customer2 deposits and increase customer1 deposits on transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(janeDoe, johnDoe, 50);
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(150);
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(50);
  });
  it("should decrease bank liabilities with customer1 on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(barclays.liabilities.customerDeposits[1].amount).toBe(50);
  });
  it("should increase bank liabilities with customer2 on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(barclays.liabilities.customerDeposits[2].amount).toBe(150);
  });
  it("should increase c1.L and b.A overdraft on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(johnDoe.liabilities.customerOverdrafts[1].amount).toBe(50);
    expect(barclays.assets.customerOverdrafts[1].amount).toBe(50);
  });
});

describe("transfers across multiple banks", () => {
  it("should create two customer accounts each with a different bank", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    expect(johnDoe.assets.customerDeposits[1].id).toBe("BARCLAYS");
    expect(janeDoe.assets.customerDeposits[1].id).toBe("HSBC");
    expect(hsbc.balances.customerDeposits[1].id).toBe("JANE_DOE");
    expect(barclays.balances.customerDeposits[1].id).toBe("JOHN_DOE");
  });
  it("should decrease customer1 deposits and increase customer2 deposits on transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(50);
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(150);
  });
  it("should decrease customer2 deposits and increase customer1 deposits on transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(janeDoe, johnDoe, 50);
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(150);
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(50);
  });
  it("should decrease bank liabilities with customer1 on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(barclays.liabilities.customerDeposits[1].amount).toBe(50);
  });
  it("should increase bank liabilities with customer2 on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(hsbc.liabilities.customerDeposits[1].amount).toBe(150);
  });
  it("should increase c1.L and b.A overdraft on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(johnDoe.liabilities.customerOverdrafts[1].amount).toBe(50);
    expect(barclays.assets.customerOverdrafts[1].amount).toBe(50);
  });
  it("should increase c2.L and b2.A overdraft on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(janeDoe, johnDoe, 150);
    expect(janeDoe.liabilities.customerOverdrafts[1].amount).toBe(50);
    expect(hsbc.assets.customerOverdrafts[1].amount).toBe(50);
  });
});

describe("dues", () => {
  it("should have dues on both sides of balance sheet", () => {
    const { hsbc } = createInterBank();
    expect(hsbc.assets.dues).toEqual([{ id: "id", amount: 0 }]);
    expect(hsbc.liabilities.dues).toEqual([{ id: "id", amount: 0 }]);
  });
  test("bank A should have due on liabilities after transfer from c1 to c2", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(barclays.liabilities.dues[1]).toEqual({ id: "HSBC", amount: 150 });
    expect(barclays.assets.dues.length).toBe(1);
  });
  test("bank B should have due on assets after transfer from c1 to c2", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(hsbc.assets.dues[1]).toEqual({ id: "BARCLAYS", amount: 150 });
    expect(hsbc.liabilities.dues.length).toBe(1);
  });
  it("should have dues on assets and liabilities after corresponding transfers between customers", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    Customer.transfer(janeDoe, johnDoe, 150);
    expect(hsbc.assets.dues[1]).toEqual({ id: "BARCLAYS", amount: 150 });
    expect(hsbc.liabilities.dues[1]).toEqual({ id: "BARCLAYS", amount: 150 });
    expect(barclays.assets.dues[1]).toEqual({ id: "HSBC", amount: 150 });
    expect(barclays.liabilities.dues[1]).toEqual({ id: "HSBC", amount: 150 });
  });
  it("should increase same due account as customer1 makes multiple transfers", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(johnDoe, janeDoe, 100);
    expect(barclays.liabilities.dues[1]).toEqual({ id: "HSBC", amount: 300 });
    expect(hsbc.assets.dues[1]).toEqual({ id: "BARCLAYS", amount: 300 });
  });
  test("banks should net correct amounts after multiple transfers", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(janeDoe, johnDoe, 50);
    Customer.transfer(janeDoe, johnDoe, 50);
    Customer.transfer(janeDoe, johnDoe, 50);
    hsbc.netAccounts(barclays);
    barclays.netAccounts(hsbc);
    expect(hsbc.assets.dues[1].amount).toBe(150);
    expect(hsbc.liabilities.dues[1].amount).toBe(0);
    expect(barclays.liabilities.dues[1].amount).toBe(150);
    expect(barclays.assets.dues[1].amount).toBe(0);
  });

  it("should net dues to zeros if banks owe same amount", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(johnDoe, janeDoe, 100);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, johnDoe, 100);
    hsbc.netAccounts(barclays);
    barclays.netAccounts(hsbc);
    expect(hsbc.assets.dues[1].amount).toBe(0);
    expect(hsbc.liabilities.dues[1].amount).toBe(0);
    expect(barclays.liabilities.dues[1].amount).toBe(0);
    expect(barclays.assets.dues[1].amount).toBe(0);
  })
  it("should return without error if neither bank has a dues account", () => {
    const { hsbc, barclays } = createInterBank();
    hsbc.netAccounts(barclays);
    barclays.netAccounts(hsbc);
    expect(hsbc.assets.dues.length).toBe(1);
    expect(hsbc.liabilities.dues.length).toBe(1);
    expect(barclays.assets.dues.length).toBe(1);
    expect(barclays.liabilities.dues.length).toBe(1);
  });
  it("should return without error if only one bank has a dues account", () => {
    const { hsbc, barclays } = createInterBank();
    hsbc.netAccounts(barclays);
    expect(hsbc.assets.dues.length).toBe(1);
    expect(hsbc.liabilities.dues.length).toBe(1);
    expect(barclays.assets.dues.length).toBe(1);
    expect(barclays.liabilities.dues.length).toBe(1);
  });
  fit("should net dues then transfer correct amounts", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createCustomerAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    Customer.transfer(johnDoe, janeDoe, 150);
    Customer.transfer(johnDoe, janeDoe, 150);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, johnDoe, 100);
    Bank.netTransfer(hsbc, barclays)
    // expect(hsbc.assets.dues[1].amount).toBe(150);
    // expect(hsbc.liabilities.dues[1].amount).toBe(0);
    // expect(barclays.liabilities.dues[1].amount).toBe(150);
    // expect(barclays.assets.dues[1].amount).toBe(0);
  })
});
