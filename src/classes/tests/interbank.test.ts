import "@testing-library/jest-dom";
import { Customer } from "../classes";
import { createInterBank } from "./testFixtures";

describe("interbank transfers", () => {
  it("should create two customer accounts", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    expect(johnDoe.assets.customerDeposits[1].id).toBe("BARCLAYS")
    expect(janeDoe.assets.customerDeposits[1].id).toBe("BARCLAYS")
    expect(barclays.balances.customerDeposits[1].id).toBe("JOHN DOE")
    expect(barclays.balances.customerDeposits[2].id).toBe("JANE DOE")
  });
  it("should decrease customer1 deposits and increase customer2 deposits on transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    // Customer.makeTransfer(johnDoe, janeDoe, 50)
  })
});
