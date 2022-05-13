import { SetStateAction, useState } from "react";
import "../App.css";
import BankComponent from "../components/ui/BankComponent";
import SelectedCustomer from "../components/ui/SelectedCustomer";
import { Customer, CommercialBank, Bank } from "../classes/instances";

import {
  CustomerService,
  BankService,
  ClearingHouseService,
} from "../classes/services";

import CustomerComponent from "../components/ui/CustomerComponent";
import ClearingHouseComponent from "../components/ui/ClearingHouseComponent";

import { clearinghouseSystem } from "./state";
const { clearinghouse, bank1, bank2, customer1, customer2 } =
  clearinghouseSystem();

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [banks, setBanks] = useState<Bank[]>([bank1, bank2]);
  const [customers, setCustomers] = useState<Customer[]>([
    customer1,
    customer2,
  ]);
  function selectCustomer(customer: Customer) {
    setSelectedCustomer(customer);
  }

  //components
  const BankComponents = banks.map((bank) => (
    <BankComponent bank={bank} netDues={netDues} />
  ));
  const CustomerComponents = customers.map((customer) => {
    const otherCustomers = customers.filter((c) => c.id !== customer.id);
    const customersBankId =
      customer.balances.customerDeposits[0].id.split("-")[1];
    const bank = banks.filter((b) => b.id === customersBankId);
    return (
      
      <CustomerComponent
        customer1={customer}
        customer2={otherCustomers[0]}
        bank1={bank[0]}
        transfer={transfer}
        deposit={deposit}
        selectCustomer={selectCustomer}
      />
    );
  });

  //form functions
  const [newCustomerId, setNewCustomerId] = useState("");
  const [newBankId, setNewBankId] = useState("");
  const handleChangeCustomerId = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewCustomerId(event.target.value);
  };
  const handleChangeBankId = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewBankId(event.target.value);
  };

  //create functions
  function createCustomer() {
    const newCustomer = new Customer(newCustomerId);
    CustomerService.openAccount(newCustomer, bank1);
    setCustomers([...customers, newCustomer]);
  }
  function createBank() {
    const newBank = new CommercialBank(newBankId);
    ClearingHouseService.openAccount(newBank, clearinghouse);
    for (const bank of banks) {
      BankService.openAccount(newBank, bank);
      BankService.openAccount(bank, newBank);
    }
    setBanks([...banks, newBank]);
  }

  //component functions
  function transfer(customer1: Customer, customer2: Customer) {
    CustomerService.transfer(customer1, customer2, 50);
    setBanks([...banks]);
  }
  function deposit(customer1: Customer, bank1: Customer) {
    CustomerService.deposit(customer1, bank1, 50);
    setBanks([...banks]);
  }
  function netDues() {
    BankService.netDues(bank1);
    BankService.netDues(bank2);
    setBanks([...banks]);
  }
  function settleDues() {
    ClearingHouseService.settleDues();
    setBanks([...banks]);
  }
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "70vw",
          height: "100vh",
          overflow: "scroll",
        }}
      >
        <ClearingHouseComponent bank={clearinghouse} settleDues={settleDues} />
        {BankComponents.map((bank) => {
          return bank;
        })}
        {CustomerComponents.map((customer) => {
          return customer;
        })}
      </div>
      <div style={{ width: "30vw" }}>
        <div>
          <input
            type="text"
            id="new-cust-id"
            name="new-cust-id"
            onChange={handleChangeCustomerId}
            value={newCustomerId}
            autoComplete="off"
          />
          <button onClick={createCustomer}>Create Customer</button>
        </div>
        <div>
          <input
            type="text"
            id="new-bank-id"
            name="new-bank-id"
            onChange={handleChangeBankId}
            value={newBankId}
            autoComplete="off"
          />
          <button onClick={createBank}>Create Bank</button>
        </div>
        {/* <SelectedCustomer
          customer={selectedCustomer}
          transfer={transfer}
          deposit={deposit}
        /> */}
      </div>
    </div>
  );
}

export default App;
