import { Customer, Bank } from "../../classes/instances";
import { CustomerService } from "../../classes/services";

export function openAccount(customer: Customer, bank: Bank) {
  CustomerService.openAccount(customer, bank);
}
export function deposit(customer: Customer, bank: Bank, amount: number) {
  CustomerService.deposit(customer, bank, amount);
}
export function withdraw(customer: Customer, bank: Bank, amount: number) {
  CustomerService.withdraw(customer, bank, amount);
}
export function transfer(
  customerA: Customer,
  customerB: Customer,
  amount: number,
  bankA?: Bank,
  bankB?: Bank
) {
  CustomerService.transfer(customerA, customerB, amount, bankA, bankB);
}
export function createLoan(
  customer: Customer,
  bank: Bank,
  amount: number,
  rate: number = 10
) {
  CustomerService.createLoan(customer, bank, amount, rate);
}
export function repayLoan(customer: Customer, bank: Bank, amount: number) {
  CustomerService.repayLoan(customer, bank, amount);
}
export function repayLoanReserves(
  customer: Customer,
  bank: Bank,
  amount: number
) {
  CustomerService.repayLoanReserves(customer, bank, amount);
}

export const customerUtils = {
  openAccount(customer: Customer, bank: Bank) {
    CustomerService.openAccount(customer, bank);
  },
  deposit(customer: Customer, bank: Bank, amount: number) {
    CustomerService.deposit(customer, bank, amount);
  },
  withdraw(customer: Customer, bank: Bank, amount: number) {
    CustomerService.withdraw(customer, bank, amount);
  },
  transfer(
    customerA: Customer,
    customerB: Customer,
    amount: number,
    bankA?: Bank,
    bankB?: Bank
  ) {
    CustomerService.transfer(customerA, customerB, amount, bankA, bankB);
  },
  createLoan(
    customer: Customer,
    bank: Bank,
    amount: number,
    rate: number = 10
  ) {
    CustomerService.createLoan(customer, bank, amount, rate);
  },
  repayLoan(customer: Customer, bank: Bank, amount: number) {
    CustomerService.repayLoan(customer, bank, amount);
  },
  repayLoanReserves(customer: Customer, bank: Bank, amount: number) {
    CustomerService.repayLoanReserves(customer, bank, amount);
  },
};
