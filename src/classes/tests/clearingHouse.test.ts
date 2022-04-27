//TODO: WORK ON GIVE DETAILS/ SHARE DETAILS
import "@testing-library/jest-dom";
import { Bank, CommercialBank, Customer, ClearingHouse } from "../classes";
import { clearingHouseSystem } from "./testFixtures";
function setup(
  santander: CommercialBank,
  hsbc: CommercialBank,
  barclays: CommercialBank,
  johnDoe: Customer,
  janeDoe: Customer,
  bobSmith: Customer
) {
  Bank.createCorrespondingAccounts(
    hsbc,
    barclays,
    1000,
    "bankDeposits",
    "bankOverdrafts"
  );
  Bank.createCorrespondingAccounts(
    hsbc,
    santander,
    1000,
    "bankDeposits",
    "bankOverdrafts"
  );
  Bank.createCorrespondingAccounts(
    barclays,
    santander,
    1000,
    "bankDeposits",
    "bankOverdrafts"
  );
  Customer.createSubordinateAccount(
    johnDoe,
    barclays,
    1000,
    "customerDeposits",
    "customerOverdrafts"
  );
  Customer.createSubordinateAccount(
    janeDoe,
    hsbc,
    1000,
    "customerDeposits",
    "customerOverdrafts"
  );
  Customer.createSubordinateAccount(
    bobSmith,
    santander,
    1000,
    "customerDeposits",
    "customerOverdrafts"
  );
  Customer.giveDetails(johnDoe, janeDoe, barclays);
  Customer.giveDetails(janeDoe, johnDoe, hsbc);
  Customer.giveDetails(janeDoe, bobSmith, hsbc);
  Customer.giveDetails(bobSmith, janeDoe, santander);
  Customer.giveDetails(johnDoe, bobSmith, barclays);
  Customer.giveDetails(bobSmith, johnDoe, santander);
}
function randomiseTransfers(customers: Customer[]) {
  let transferInstances = Math.floor(Math.random() * 30);

  for (let i = 0; i < transferInstances; i++) {
    let randomCustomerIndex = Math.floor(Math.random() * customers.length);
    let randomC1 = customers[randomCustomerIndex];
    let remainingCustomers = customers.filter(
      (customer) => customer.id !== randomC1.id
    );
    let randomC2 = remainingCustomers[Math.floor(Math.random() * 2)];
    Customer.transfer(randomC1, randomC2, Math.round(Math.random() * 250));
  }
}


describe("totaling transfers", () => {
  it("should total dues from", () => {
    const { clearingHouse, santander, hsbc, barclays, johnDoe, janeDoe, bobSmith } =
      clearingHouseSystem();
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    ClearingHouse.create([santander, barclays, hsbc], clearingHouse)
    Customer.transfer(johnDoe, janeDoe, 110);
    Customer.transfer(johnDoe, janeDoe, 120);
    Customer.transfer(johnDoe, bobSmith, 130);
    Customer.transfer(johnDoe, bobSmith, 140);

    Customer.transfer(janeDoe, johnDoe, 90);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, bobSmith, 110);
    Customer.transfer(janeDoe, bobSmith, 120);

    Customer.transfer(bobSmith, johnDoe, 100);
    Customer.transfer(bobSmith, johnDoe, 110);
    Customer.transfer(bobSmith, janeDoe, 120);
    Customer.transfer(bobSmith, janeDoe, 130);

    const totals1 = ClearingHouse.totalAccounts(hsbc, clearingHouse);
    const totals2 = ClearingHouse.totalAccounts(barclays, clearingHouse);
    const totals3 = ClearingHouse.totalAccounts(santander, clearingHouse);
    expect(totals1.totalDueFroms.amount).toBe(480);
    expect(totals2.totalDueFroms.amount).toBe(400);
    expect(totals3.totalDueFroms.amount).toBe(500);
    expect(totals1.totalDueTos.amount).toBe(420);
    expect(totals2.totalDueTos.amount).toBe(500);
    expect(totals3.totalDueTos.amount).toBe(460);
  });
  test("total asset dues and total liability dues across all banks should be equal every time", () => {
    const { clearingHouse, santander, hsbc, barclays, johnDoe, janeDoe, bobSmith } =
      clearingHouseSystem();
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    ClearingHouse.create([santander, barclays], clearingHouse);

    randomiseTransfers([johnDoe, janeDoe, bobSmith]);

    const totals1 = ClearingHouse.totalAccounts(hsbc, clearingHouse);
    const totals2 = ClearingHouse.totalAccounts(barclays, clearingHouse);
    const totals3 = ClearingHouse.totalAccounts(santander, clearingHouse);

    const totalDueFroms =
      totals1.totalDueFroms.amount +
      totals2.totalDueFroms.amount +
      totals3.totalDueFroms.amount;
    const totalDueTos =
      totals1.totalDueTos.amount +
      totals2.totalDueTos.amount +
      totals3.totalDueTos.amount;
    expect(totalDueFroms).toBe(totalDueTos);
  });
  it("should only have clearinghouse dues in bank due accounts after totalling accounts", () => {
    const {
      clearingHouse,
      santander,
      hsbc,
      barclays,
      johnDoe,
      janeDoe,
      bobSmith,
    } = clearingHouseSystem();
    ClearingHouse.create([santander, hsbc, barclays], clearingHouse);
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    randomiseTransfers([johnDoe, janeDoe, bobSmith]);
    santander.totalAccounts();
    hsbc.totalAccounts();
    barclays.totalAccounts();
    expect(santander.assets.dues.length).toBe(1);
    expect(santander.liabilities.dues.length).toBe(1);
    expect(hsbc.assets.dues.length).toBe(1);
    expect(hsbc.liabilities.dues.length).toBe(1);
    expect(barclays.assets.dues.length).toBe(1);
    expect(barclays.liabilities.dues.length).toBe(1);
  });
  it("should have accounts in clearinghouse assets and liabilities after totalling accounts", () => {
    const {
      clearingHouse,
      santander,
      hsbc,
      barclays,
      johnDoe,
      janeDoe,
      bobSmith,
    } = clearingHouseSystem();
    ClearingHouse.create([santander, hsbc, barclays], clearingHouse);
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    Customer.transfer(johnDoe, janeDoe, 110);
    Customer.transfer(johnDoe, janeDoe, 120);
    Customer.transfer(johnDoe, bobSmith, 130);
    Customer.transfer(johnDoe, bobSmith, 140);

    Customer.transfer(janeDoe, johnDoe, 90);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, bobSmith, 110);
    Customer.transfer(janeDoe, bobSmith, 120);

    Customer.transfer(bobSmith, johnDoe, 100);
    Customer.transfer(bobSmith, johnDoe, 110);
    Customer.transfer(bobSmith, janeDoe, 120);
    Customer.transfer(bobSmith, janeDoe, 130);

    santander.totalAccounts();
    hsbc.totalAccounts();
    barclays.totalAccounts();

    expect(clearingHouse.assets.dues.length).toBeGreaterThan(0);
    expect(clearingHouse.liabilities.dues.length).toBeGreaterThan(0);
  });

  it("a banks asset should be a clearinghouse's liability; a clearinghouse's asset should be a bank's liability", () => {
    const {
      clearingHouse,
      santander,
      hsbc,
      barclays,
      johnDoe,
      janeDoe,
      bobSmith,
    } = clearingHouseSystem();
    ClearingHouse.create([santander, hsbc, barclays], clearingHouse);
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    Customer.transfer(johnDoe, janeDoe, 50);
    Customer.transfer(johnDoe, janeDoe, 50);
    Customer.transfer(janeDoe, johnDoe, 25);
    Customer.transfer(janeDoe, johnDoe, 25);

    hsbc.netAccounts(barclays);
    barclays.netAccounts(hsbc);
    const bankLiabilities = barclays.liabilities.dues[0].amount;
    const bankAssets = hsbc.assets.dues[0].amount;
    hsbc.totalAccounts();
    barclays.totalAccounts();
    const ch: Bank | undefined = ClearingHouse.get();
    const chLiabilities = ch?.liabilities.dues[0].amount;
    const chAssets = ch?.assets.dues[0].amount;
    expect(bankLiabilities).toEqual(chAssets);
    expect(bankAssets).toEqual(chLiabilities);
  });
  it("clearinghouse should collect or pay dues to banks", () => {
    const {
      clearingHouse,
      santander,
      hsbc,
      barclays,
      johnDoe,
      janeDoe,
      bobSmith,
    } = clearingHouseSystem();
    ClearingHouse.create([santander, barclays], clearingHouse);
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    Customer.transfer(johnDoe, bobSmith, 100);
    Customer.transfer(bobSmith, johnDoe, 120);
    santander.totalAccounts();
    barclays.totalAccounts();
    ClearingHouse.transfer(santander, clearingHouse);
    ClearingHouse.transfer(barclays, clearingHouse);
    expect(santander.assets.chCertificates[0].amount).toBe(9980);
    expect(barclays.assets.chCertificates[0].amount).toBe(10020);
    expect(clearingHouse.liabilities.chCertificates[0].amount).toBe(9980);
    expect(clearingHouse.liabilities.chCertificates[1].amount).toBe(10020);
  });
  test("a clearinghouse should only have chCertificates liabilities. a bank should only have chCertificates assets", () => {
    const { clearingHouse, santander, barclays } = clearingHouseSystem();
    ClearingHouse.create([santander, barclays], clearingHouse);
    expect(clearingHouse.assets.chCertificates.length).toBe(0);
    expect(clearingHouse.liabilities.chCertificates.length).toBe(2);
    expect(santander.liabilities.chCertificates.length).toBe(0);
    expect(santander.assets.chCertificates.length).toBe(1);
  });
  test("total accounts statically", () => {
    const { clearingHouse, santander, barclays } = clearingHouseSystem();
    ClearingHouse.create([santander, barclays], clearingHouse);
    expect(clearingHouse.assets.chCertificates.length).toBe(0);
    expect(clearingHouse.liabilities.chCertificates.length).toBe(2);
    expect(santander.liabilities.chCertificates.length).toBe(0);
    expect(santander.assets.chCertificates.length).toBe(1);
  });
  it("static clearinghouse should collect or pay dues to banks", () => {
    const {
      clearingHouse,
      santander,
      hsbc,
      barclays,
      johnDoe,
      janeDoe,
      bobSmith,
    } = clearingHouseSystem();
    ClearingHouse.create([santander, barclays], clearingHouse);
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    Customer.transfer(johnDoe, bobSmith, 100);
    Customer.transfer(bobSmith, johnDoe, 120);
    ClearingHouse.totalAccounts(santander, clearingHouse);
    ClearingHouse.totalAccounts(barclays, clearingHouse);
    ClearingHouse.transfer(santander, clearingHouse);
    ClearingHouse.transfer(barclays, clearingHouse);
    expect(santander.assets.chCertificates[0].amount).toBe(9980);
    expect(barclays.assets.chCertificates[0].amount).toBe(10020);
    expect(clearingHouse.liabilities.chCertificates[0].amount).toBe(9980);
    expect(clearingHouse.liabilities.chCertificates[1].amount).toBe(10020);
  });
  it("should be ok on second try", () => {
    const {
      clearingHouse,
      santander,
      hsbc,
      barclays,
      johnDoe,
      janeDoe,
      bobSmith,
    } = clearingHouseSystem();
    ClearingHouse.create([santander, hsbc, barclays], clearingHouse);
    setup(santander, hsbc, barclays, johnDoe, janeDoe, bobSmith);
    let banks = [santander, hsbc, barclays];
    Customer.transfer(johnDoe, janeDoe, 110);
    Customer.transfer(johnDoe, janeDoe, 120);
    Customer.transfer(johnDoe, bobSmith, 130);
    Customer.transfer(johnDoe, bobSmith, 140);

    Customer.transfer(janeDoe, johnDoe, 90);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, bobSmith, 110);
    Customer.transfer(janeDoe, bobSmith, 120);

    Customer.transfer(bobSmith, johnDoe, 100);
    Customer.transfer(bobSmith, johnDoe, 110);
    Customer.transfer(bobSmith, janeDoe, 120);
    Customer.transfer(bobSmith, janeDoe, 130);
    console.log(barclays.liabilities);
    banks.forEach((b) => {
      ClearingHouse.totalAccounts(b, clearingHouse);
      ClearingHouse.transfer(b, clearingHouse);
    });
    console.log(clearingHouse.assets);

    Customer.transfer(johnDoe, janeDoe, 110);
    Customer.transfer(johnDoe, janeDoe, 120);
    Customer.transfer(johnDoe, bobSmith, 130);
    Customer.transfer(johnDoe, bobSmith, 140);

    Customer.transfer(janeDoe, johnDoe, 90);
    Customer.transfer(janeDoe, johnDoe, 100);
    Customer.transfer(janeDoe, bobSmith, 110);
    Customer.transfer(janeDoe, bobSmith, 120);

    Customer.transfer(bobSmith, johnDoe, 100);
    Customer.transfer(bobSmith, johnDoe, 110);
    Customer.transfer(bobSmith, janeDoe, 120);
    Customer.transfer(bobSmith, janeDoe, 130);
    console.log(barclays.liabilities);
    banks.forEach((b) => {
      ClearingHouse.totalAccounts(b, clearingHouse);
      ClearingHouse.transfer(b, clearingHouse);
    });
    console.log(clearingHouse.assets);
  });
});
