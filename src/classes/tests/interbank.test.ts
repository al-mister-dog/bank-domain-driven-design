//TODO: WORK ON GIVE DETAILS/ SHARE DETAILS
import "@testing-library/jest-dom";
import { Bank, CommercialBank, Customer } from "../classes";
import { createInterBank } from "./testFixtures";

describe("transfers within one bank", () => {
  it("should create two customer accounts", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    expect(johnDoe.assets.customerDeposits[0].id).toBe("BARCLAYS");
    expect(janeDoe.assets.customerDeposits[0].id).toBe("BARCLAYS");
    expect(barclays.balances.customerDeposits[0].id).toBe("JOHN_DOE");
    expect(barclays.balances.customerDeposits[1].id).toBe("JANE_DOE");
  });
  it("should decrease customer1 deposits and increase customer2 deposits on transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(johnDoe.assets.customerDeposits[0].amount).toBe(50);
    expect(janeDoe.assets.customerDeposits[0].amount).toBe(150);
  });
  it("should decrease customer2 deposits and increase customer1 deposits on transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(janeDoe, johnDoe, 50);
    expect(johnDoe.assets.customerDeposits[0].amount).toBe(150);
    expect(janeDoe.assets.customerDeposits[0].amount).toBe(50);
  });
  it("should decrease bank liabilities with customer1 on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(barclays.liabilities.customerDeposits[0].amount).toBe(50);
  });
  it("should increase bank liabilities with customer2 on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(barclays.liabilities.customerDeposits[1].amount).toBe(150);
  });
  it("should increase c1.L and b.A overdraft on customer1 transfer", () => {
    const { barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.shareDetails(johnDoe, janeDoe, barclays);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(johnDoe.liabilities.customerOverdrafts[0].amount).toBe(50);
    expect(barclays.assets.customerOverdrafts[0].amount).toBe(50);
  });
});

describe("transfers across multiple banks", () => {
  it("should create two customer accounts each with a different bank", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    expect(johnDoe.assets.customerDeposits[0].id).toBe("BARCLAYS");
    expect(janeDoe.assets.customerDeposits[0].id).toBe("HSBC");
    expect(hsbc.balances.customerDeposits[0].id).toBe("JANE_DOE");
    expect(barclays.balances.customerDeposits[0].id).toBe("JOHN_DOE");
  });
  it("should decrease customer1 deposits and increase customer2 deposits on transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(johnDoe.assets.customerDeposits[0].amount).toBe(50);
    expect(janeDoe.assets.customerDeposits[0].amount).toBe(150);
  });
  it("should decrease customer2 deposits and increase customer1 deposits on transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(janeDoe, johnDoe, 50);
    expect(johnDoe.assets.customerDeposits[0].amount).toBe(150);
    expect(janeDoe.assets.customerDeposits[0].amount).toBe(50);
  });
  it("should decrease bank liabilities with customer1 on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(barclays.liabilities.customerDeposits[0].amount).toBe(50);
  });
  it("should increase bank liabilities with customer2 on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 50);
    expect(hsbc.liabilities.customerDeposits[0].amount).toBe(150);
  });
  it("should increase c1.L and b.A overdraft on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(johnDoe.liabilities.customerOverdrafts[0].amount).toBe(50);
    expect(barclays.assets.customerOverdrafts[0].amount).toBe(50);
  });
  it("should increase c2.L and b2.A overdraft on customer1 transfer", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(janeDoe, johnDoe, 150);
    expect(janeDoe.liabilities.customerOverdrafts[0].amount).toBe(50);
    expect(hsbc.assets.customerOverdrafts[0].amount).toBe(50);
  });
});

describe("dues", () => {
  it("should have dues on both sides of balance sheet", () => {
    const { hsbc } = createInterBank();
    expect(Array.isArray(hsbc.assets.dues)).toBe(true)
    expect(Array.isArray(hsbc.liabilities.dues)).toBe(true)
  });
  test("bank A should have due on liabilities after transfer from c1 to c2", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(barclays.liabilities.dues[0]).toEqual({ id: "HSBC", amount: 150 });
    expect(barclays.assets.dues.length).toBe(0);
  });
  test("bank B should have due on assets after transfer from c1 to c2", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
      janeDoe,
      hsbc,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.giveDetails(johnDoe, janeDoe, barclays);
    Customer.giveDetails(janeDoe, johnDoe, hsbc);
    Customer.transfer(johnDoe, janeDoe, 150);
    expect(hsbc.assets.dues[0]).toEqual({ id: "BARCLAYS", amount: 150 });
    expect(hsbc.liabilities.dues.length).toBe(0);
  });
  it("should have dues on assets and liabilities after corresponding transfers between customers", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
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
    expect(hsbc.assets.dues[0]).toEqual({ id: "BARCLAYS", amount: 150 });
    expect(hsbc.liabilities.dues[0]).toEqual({ id: "BARCLAYS", amount: 150 });
    expect(barclays.assets.dues[0]).toEqual({ id: "HSBC", amount: 150 });
    expect(barclays.liabilities.dues[0]).toEqual({ id: "HSBC", amount: 150 });
  });
  it("should increase same due account as customer1 makes multiple transfers", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
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
    expect(barclays.liabilities.dues[0]).toEqual({ id: "HSBC", amount: 300 });
    expect(hsbc.assets.dues[0]).toEqual({ id: "BARCLAYS", amount: 300 });
  });
  test("banks should net correct amounts after multiple transfers", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
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
    expect(hsbc.assets.dues[0].amount).toBe(150);
    expect(hsbc.liabilities.dues[0].amount).toBe(0);
    expect(barclays.liabilities.dues[0].amount).toBe(150);
    expect(barclays.assets.dues[0].amount).toBe(0);
  });

  it("should net dues to zeros if banks owe same amount", () => {
    const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
    Customer.createSubordinateAccount(
      johnDoe,
      barclays,
      100,
      "customerDeposits",
      "customerOverdrafts"
    );
    Customer.createSubordinateAccount(
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
    expect(hsbc.assets.dues[0].amount).toBe(0);
    expect(hsbc.liabilities.dues[0].amount).toBe(0);
    expect(barclays.liabilities.dues[0].amount).toBe(0);
    expect(barclays.assets.dues[0].amount).toBe(0);
  })
  it("should return without error if neither bank has a dues account", () => {
    const { hsbc, barclays } = createInterBank();
    hsbc.netAccounts(barclays);
    barclays.netAccounts(hsbc);
    expect(hsbc.assets.dues.length).toBe(0);
    expect(hsbc.liabilities.dues.length).toBe(0);
    expect(barclays.assets.dues.length).toBe(0);
    expect(barclays.liabilities.dues.length).toBe(0);
  });
  it("should return without error if only one bank has a dues account", () => {
    const { hsbc, barclays } = createInterBank();
    hsbc.netAccounts(barclays);
    expect(hsbc.assets.dues.length).toBe(0);
    expect(hsbc.liabilities.dues.length).toBe(0);
    expect(barclays.assets.dues.length).toBe(0);
    expect(barclays.liabilities.dues.length).toBe(0);
  });
  describe("static net transfer", () => {
    it("should net dues then transfer correct amounts", () => {
      const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
      Bank.createCorrespondingAccounts(hsbc, barclays, 1000,"bankDeposits",
      "bankOverdrafts");
      Customer.createSubordinateAccount(
        johnDoe,
        barclays,
        100,
        "customerDeposits",
        "customerOverdrafts"
      );
      Customer.createSubordinateAccount(
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
      expect(hsbc.assets.dues[0].amount).toBe(450)
      expect(hsbc.liabilities.dues[0].amount).toBe(300)
      expect(barclays.assets.dues[0].amount).toBe(300)
      expect(barclays.liabilities.dues[0].amount).toBe(450)
      expect(hsbc.assets.bankDeposits[0].amount).toBe(1000)
      expect(hsbc.liabilities.bankDeposits[0].amount).toBe(1000)
      expect(barclays.assets.bankDeposits[0].amount).toBe(1000)
      expect(barclays.liabilities.bankDeposits[0].amount).toBe(1000)
      CommercialBank.netAccountsAndTransfer(hsbc, barclays)
      expect(hsbc.assets.dues[0].amount).toBe(0)
      expect(hsbc.liabilities.dues[0].amount).toBe(0)
      expect(barclays.assets.dues[0].amount).toBe(0)
      expect(barclays.liabilities.dues[0].amount).toBe(0)
      expect(hsbc.assets.bankDeposits[0].amount).toBe(1150)
      expect(hsbc.liabilities.bankDeposits[0].amount).toBe(1000)
      expect(barclays.assets.bankDeposits[0].amount).toBe(1000)
      expect(barclays.liabilities.bankDeposits[0].amount).toBe(1150)
    })
    it("should net dues then transfer correct amounts procedurally", () => {
      const { hsbc, barclays, johnDoe, janeDoe } = createInterBank();
      Bank.createCorrespondingAccounts(hsbc, barclays, 1000,"bankDeposits",
      "bankOverdrafts");
      Customer.createSubordinateAccount(
        johnDoe,
        barclays,
        100,
        "customerDeposits",
        "customerOverdrafts"
      );
      Customer.createSubordinateAccount(
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
      expect(hsbc.assets.dues[0].amount).toBe(450)
      expect(hsbc.liabilities.dues[0].amount).toBe(300)
      expect(barclays.assets.dues[0].amount).toBe(300)
      expect(barclays.liabilities.dues[0].amount).toBe(450)
      expect(hsbc.assets.bankDeposits[0].amount).toBe(1000)
      expect(hsbc.liabilities.bankDeposits[0].amount).toBe(1000)
      expect(barclays.assets.bankDeposits[0].amount).toBe(1000)
      expect(barclays.liabilities.bankDeposits[0].amount).toBe(1000)
      hsbc.netAccounts(barclays)
      barclays.netAccounts(hsbc)
      expect(hsbc.assets.dues[0].amount).toBe(150)
      expect(hsbc.liabilities.dues[0].amount).toBe(0)
      expect(barclays.assets.dues[0].amount).toBe(0)
      expect(barclays.liabilities.dues[0].amount).toBe(150)
      function mockFunction() {
        if (true) {
          CommercialBank.creditAccount(hsbc, barclays, 150)
          Bank.clearCorrespondingDues(hsbc, barclays)
        }
      }
      mockFunction()
      expect(hsbc.assets.dues[0].amount).toBe(0)
      expect(hsbc.liabilities.dues[0].amount).toBe(0)
      expect(barclays.assets.dues[0].amount).toBe(0)
      expect(barclays.liabilities.dues[0].amount).toBe(0)
      
      expect(hsbc.assets.bankDeposits[0].amount).toBe(1150)
      expect(hsbc.liabilities.bankDeposits[0].amount).toBe(1000)
      expect(barclays.assets.bankDeposits[0].amount).toBe(1000)
      expect(barclays.liabilities.bankDeposits[0].amount).toBe(1150)
    })
  })
  
});
