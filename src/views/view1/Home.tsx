import { useState } from "react";
import { Customer, Bank } from "../../classes/instances";
import {
  BankService,
  CustomerService,
  ClearingHouseService,
} from "../../classes/services";
import List from "./List";
import { correspondentSystemManyToMany } from "./store";
const {
  customer1,
  customer2,
  customer3,
  customer4,
  bank1,
  bank2,
  bank3,
  bank4,
} = correspondentSystemManyToMany();
// const allBanks = correspondentSystemManyToMany()

const Home = () => {
  const [state, setState] = useState(true);
  const [selected, setSelected] = useState<Bank | null>();

  const banks = [bank1, bank2, bank3, bank4];
  const customers = [customer1, customer2, customer3, customer4];

  function openAccount(customer: Customer, bank: Bank) {
    CustomerService.openAccount(customer, bank);
    setState(!state);
  }
  function onDeposit(selected: Bank | Customer) {
    deposit(selected, bank1, 100);
  }
  function deposit(customer: Customer, bank: Bank, amount: number) {
    CustomerService.deposit(customer, bank, amount);
    setState(!state);
  }
  function onWithdraw(selected: Bank | Customer) {
    withdraw(selected, bank1, 100);
  }
  function withdraw(customer: Customer, bank: Bank, amount: number) {
    CustomerService.withdraw(customer, bank, amount);
    setState(!state);
  }
  function transfer(
    customerA: Customer,
    customerB: Customer,
    amount: number,
    bankA?: Bank,
    bankB?: Bank
  ) {
    CustomerService.transfer(customerA, customerB, amount, bankA, bankB);
    setState(!state);
  }
  function createLoan(
    customer: Customer,
    bank: Bank,
    amount: number,
    rate: number = 10
  ) {
    CustomerService.createLoan(customer, bank, amount, rate);
    setState(!state);
  }
  function repayLoan(customer: Customer, bank: Bank, amount: number) {
    CustomerService.repayLoan(customer, bank, amount);
    setState(!state);
  }
  function repayLoanReserves(customer: Customer, bank: Bank, amount: number) {
    CustomerService.repayLoanReserves(customer, bank, amount);
    setState(!state);
  }

  function select(b: Bank) {
    setSelected(b);
  }
  return (
    <>
      <h1>Home</h1>
      <List banks={banks} customers={customers} select={select} />
      <h1>Selected:</h1>
      {selected && (
        <div>
          <button onClick={() => onDeposit(selected)}>deposit</button>
          <button onClick={() => onWithdraw(selected)}>withdraw</button>
          <h6>{JSON.stringify(selected.inOverdraft())}</h6>
          <p>assets</p>
          <p>{JSON.stringify(selected.assets)}</p>
          <p>liabilities</p>
          <p>{JSON.stringify(selected.liabilities)}</p>
        </div>
      )}
    </>
  );
};
export default Home;
