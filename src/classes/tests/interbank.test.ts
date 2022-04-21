//TODO: WORK ON GIVE DETAILS/ SHARE DETAILS
import "@testing-library/jest-dom";
import { Customer } from "../classes";
import { createInterBank } from "./testFixtures";

describe("transfers within one bank", () => {
  it("should create two customer accounts", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    expect(johnDoe.assets.customerDeposits[1].id).toBe("BARCLAYS")
    expect(janeDoe.assets.customerDeposits[1].id).toBe("BARCLAYS")
    expect(barclays.balances.customerDeposits[1].id).toBe("JOHN_DOE")
    expect(barclays.balances.customerDeposits[2].id).toBe("JANE_DOE")
  });
  it("should decrease customer1 deposits and increase customer2 deposits on transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.shareDetails(johnDoe, janeDoe, barclays)
    Customer.transfer(johnDoe, janeDoe, 50)
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(50)
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(150)
  })
  it("should decrease customer2 deposits and increase customer1 deposits on transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.shareDetails(johnDoe, janeDoe, barclays)
    Customer.transfer(janeDoe, johnDoe, 50)
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(150)
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(50)
  })
  it("should decrease bank liabilities with customer1 on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.shareDetails(johnDoe, janeDoe, barclays)
    Customer.transfer(johnDoe, janeDoe, 50)
    expect(barclays.liabilities.customerDeposits[1].amount).toBe(50)
  })
  it("should increase bank liabilities with customer2 on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.shareDetails(johnDoe, janeDoe, barclays)
    Customer.transfer(johnDoe, janeDoe, 50)
    expect(barclays.liabilities.customerDeposits[2].amount).toBe(150)
  })
  it("should increase c1.L and b.A overdraft on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.shareDetails(johnDoe, janeDoe, barclays)
    Customer.transfer(johnDoe, janeDoe, 150)
    expect(johnDoe.liabilities.customerOverdrafts[1].amount).toBe(50)
    expect(barclays.assets.customerOverdrafts[1].amount).toBe(50)
  })
});

describe("transfers across multiple banks", () => {
  it("should create two customer accounts each with a different bank", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    expect(johnDoe.assets.customerDeposits[1].id).toBe("BARCLAYS")
    expect(janeDoe.assets.customerDeposits[1].id).toBe("HSBC")
    expect(hsbc.balances.customerDeposits[1].id).toBe("JANE_DOE")
    expect(barclays.balances.customerDeposits[1].id).toBe("JOHN_DOE")
  });
  it("should decrease customer1 deposits and increase customer2 deposits on transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    Customer.giveDetails(johnDoe, janeDoe, barclays)
    Customer.giveDetails(janeDoe, johnDoe, hsbc)
    Customer.interTransfer(johnDoe, janeDoe, 50)
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(50)
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(150)
  })
  it("should decrease customer2 deposits and increase customer1 deposits on transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    Customer.giveDetails(johnDoe, janeDoe, barclays)
    Customer.giveDetails(janeDoe, johnDoe, hsbc)
    Customer.interTransfer(janeDoe, johnDoe, 50)
    expect(johnDoe.assets.customerDeposits[1].amount).toBe(150)
    expect(janeDoe.assets.customerDeposits[1].amount).toBe(50)
  })
  it("should decrease bank liabilities with customer1 on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    Customer.giveDetails(johnDoe, janeDoe, barclays)
    Customer.giveDetails(janeDoe, johnDoe, hsbc)
    Customer.interTransfer(johnDoe, janeDoe, 50)
    expect(barclays.liabilities.customerDeposits[1].amount).toBe(50)
  })
  it("should increase bank liabilities with customer2 on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    Customer.giveDetails(johnDoe, janeDoe, barclays)
    Customer.giveDetails(janeDoe, johnDoe, hsbc)
    Customer.interTransfer(johnDoe, janeDoe, 50)
    expect(hsbc.liabilities.customerDeposits[1].amount).toBe(150)
  })
  it("should increase c1.L and b.A overdraft on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    Customer.giveDetails(johnDoe, janeDoe, barclays)
    Customer.giveDetails(janeDoe, johnDoe, hsbc)
    Customer.interTransfer(johnDoe, janeDoe, 150)
    expect(johnDoe.liabilities.customerOverdrafts[1].amount).toBe(50)
    expect(barclays.assets.customerOverdrafts[1].amount).toBe(50)
  })
  it("should increase c2.L and b2.A overdraft on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createCustomerAccount(johnDoe, barclays, 100, "customerDeposits", "customerOverdrafts")
    Customer.createCustomerAccount(janeDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    Customer.giveDetails(johnDoe, janeDoe, barclays)
    Customer.giveDetails(janeDoe, johnDoe, hsbc)
    Customer.interTransfer(janeDoe, johnDoe, 150)
    expect(janeDoe.liabilities.customerOverdrafts[1].amount).toBe(50)
    expect(hsbc.assets.customerOverdrafts[1].amount).toBe(50)
  })
});
