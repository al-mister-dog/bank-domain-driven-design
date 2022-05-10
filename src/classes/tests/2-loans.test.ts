import "@testing-library/jest-dom";
import { Bank, Customer } from "../classes";
import {createLoanSystem} from "./testFixtures"
describe("customer loans", () => {
  it("should open a loan on account in bank assets on takeLoan with default interest added", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 1000);
    expect(johnDoe.liabilities.customerLoans[0]).toEqual({id: "HSBC", amount: 1100})
    expect(hsbc.assets.customerLoans[0]).toEqual({id: "JOHN_DOE", amount: 1100})
  })
  it("should open a loan on account in bank assets on takeLoan with inputted interest added", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 100, "customerDeposits", "customerOverdrafts")
    const interestRate = Math.round(Math.random() * 100)
    const amountPlusInterest = 1000 + (1000 * interestRate) / 100
    Customer.createLoan(johnDoe, hsbc, 1000, interestRate);
    expect(johnDoe.liabilities.customerLoans[0]).toEqual({id: "HSBC", amount: amountPlusInterest})
    expect(hsbc.assets.customerLoans[0]).toEqual({id: "JOHN_DOE", amount: amountPlusInterest})
  })
  it("should increase deposit assets in customer and deposit liabilities without interest added in bank on takeLoan", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 0, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 1000);
    expect(johnDoe.assets.customerDeposits[0]).toEqual({id: "HSBC", amount: 1000})
    expect(hsbc.liabilities.customerDeposits[0]).toEqual({id: "JOHN_DOE", amount: 1000})
  })
  it("should decrease loan assets in bank and  loan liabilities in customer on repayLoan", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 0, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 1000);
    Customer.repayLoan(johnDoe, hsbc, 500)
    expect(johnDoe.liabilities.customerLoans[0]).toEqual({id: "HSBC", amount: 600})
    expect(hsbc.assets.customerLoans[0]).toEqual({id: "JOHN_DOE", amount: 600})
  })
  it("should decrease deposit liabilities in bank and deposit assets in customer on repayLoan", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 0, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 1000);
    Customer.repayLoan(johnDoe, hsbc, 500)
    expect(johnDoe.assets.customerDeposits[0]).toEqual({id: "HSBC", amount: 500})
    expect(hsbc.liabilities.customerDeposits[0]).toEqual({id: "JOHN_DOE", amount: 500})
  })
  it("should decrease customer reserves and increase bank reserves on repayLoanReserves", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 0, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 1000);
    Customer.repayLoanReserves(johnDoe, hsbc, 500)
    expect(johnDoe.reserves).toBe(-400)
    expect(hsbc.reserves).toBe(1500)
  })
  it("should keep deposit amounts the same on repayLoanReserves", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 0, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 1000);
    Customer.repayLoanReserves(johnDoe, hsbc, 500)
    expect(johnDoe.assets.customerDeposits[0]).toEqual({id: "HSBC", amount: 1000})
    expect(hsbc.liabilities.customerDeposits[0]).toEqual({id: "JOHN_DOE", amount: 1000})
  })
  it("should increase overdraft on repayLoan if not enough money in customer account", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 0, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 100);
    Customer.makeWithdrawal(johnDoe, hsbc, 90)
    Customer.repayLoan(johnDoe, hsbc, 100)
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({id: "HSBC", amount: 90})
    expect(hsbc.assets.customerOverdrafts[0]).toEqual({id: "JOHN_DOE", amount: 90})
  })
  it("should not increase overdraft on repayLoanReserves if not enough money in customer account", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 0, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 100);
    Customer.makeWithdrawal(johnDoe, hsbc, 100)
    Customer.repayLoanReserves(johnDoe, hsbc, 100)
    expect(johnDoe.liabilities.customerOverdrafts[0]).toEqual({id: "HSBC", amount: 0})
    expect(hsbc.assets.customerOverdrafts[0]).toEqual({id: "JOHN_DOE", amount: 0})
  })
  it("should not decrease a customers assets if more than loan amount is repaid", () => {
    const {johnDoe, hsbc} = createLoanSystem();
    Bank.createSubordinateAccount(johnDoe, hsbc, 10, "customerDeposits", "customerOverdrafts")
    Customer.createLoan(johnDoe, hsbc, 100);
    Customer.repayLoan(johnDoe, hsbc, 120)
    expect(johnDoe.assets.customerDeposits[0].amount).toBe(0);
    expect(johnDoe.liabilities.customerLoans[0].amount).toBe(0);
  })
})