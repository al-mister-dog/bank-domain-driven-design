import { useState, useRef } from "react";
import "./App.css";
import BalanceSheet from "./components/ui/BalanceSheet";
import TextField from "@mui/material/TextField";
import {
  Customer,
  CommercialBank,
  Bank,
  ClearingHouse,
} from "./classes/instances";
import {
  commercialAssets,
  commercialLiabilities,
  balances,
} from "./classes/fixtures";
function createBanksAndCustomers() {
  Bank.setBankingSystem("clearinghouse");
  const clearinghouse = new ClearingHouse(
    "clearinghouse",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    [],
    0
  );
  const bank1 = new CommercialBank(
    "Bank1",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    [],
    0
  );
  const bank2 = new CommercialBank(
    "Bank2",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    [],
    0
  );
  const customer1 = new Customer(
    "CUSTOMER1",
    { customerDeposits: [] },
    { customerOverdrafts: [], customerLoans: [] },
    { ...balances },
    []
  );
  const customer2 = new Customer(
    "CUSTOMER2",
    { customerDeposits: [] },
    { customerOverdrafts: [], customerLoans: [] },
    { ...balances },
    []
  );
  Customer.openAccount(customer1, bank1);
  Customer.openAccount(customer2, bank2);
  CommercialBank.openAccount(bank1, bank2);
  CommercialBank.openAccount(bank2, bank1);
  Customer.deposit(customer1, bank1, 100);
  Customer.deposit(customer2, bank2, 100);
  Customer.transfer(customer1, customer2, 10);
  Customer.transfer(customer1, customer2, 20);
  Customer.transfer(customer2, customer1, 30);
  Customer.transfer(customer2, customer1, 40);
  bank1.netDues();
  bank2.netDues();
  Bank.newSettleDues();
  Customer.transfer(customer1, customer2, 10);
  Customer.transfer(customer1, customer2, 20);
  Customer.transfer(customer2, customer1, 30);
  Customer.transfer(customer2, customer1, 40);
  bank1.netDues();
  bank2.netDues();
  Bank.newSettleDues();
  return { clearinghouse, bank1, bank2, customer1, customer2 };
}

const customer3 = new Customer(
  "CUSTOMER3",
  { customerDeposits: [] },
  { customerOverdrafts: [], customerLoans: [] },
  { ...balances },
  []
);
const bank3 = new CommercialBank(
  "Bank3",
  { ...commercialAssets },
  { ...commercialLiabilities },
  { ...balances },
  [],
  0
);
const customer4 = new Customer(
  "CUSTOMER4",
  { customerDeposits: [] },
  { customerOverdrafts: [], customerLoans: [] },
  { ...balances },
  []
);
const bank4 = new CommercialBank(
  "Bank4",
  { ...commercialAssets },
  { ...commercialLiabilities },
  { ...balances },
  [],
  0
);
Customer.openAccount(customer3, bank3);
Customer.openAccount(customer4, bank4);
function App() {
  const [num, setNum] = useState<number>(0);
  const { clearinghouse, bank1, bank2, customer1, customer2 } =
    createBanksAndCustomers();

  function transfer() {
    Customer.deposit(customer3, bank3, 100);
    Customer.deposit(customer4, bank4, 50);
    setNum(num + 1);
  }

  function useBank() {
    const bankRef = useRef<CommercialBank | undefined>();
    if (!bankRef.current) {
      bankRef.current = new CommercialBank(
        "blabla",
        { ...commercialAssets },
        { ...commercialLiabilities },
        { ...balances },
        [],
        0
      );
    }
    return bankRef.current;
  }

  return (
    <div className="app">
      <BalanceSheet bank={clearinghouse} />
      <BalanceSheet bank={bank1} />
      <BalanceSheet bank={bank2} />
      <BalanceSheet bank={bank3} />
      <BalanceSheet bank={customer1} />
      <BalanceSheet bank={customer2} />
      <BalanceSheet bank={customer3} />
      <BalanceSheet bank={customer4} />
      <button onClick={transfer}>transfer</button>
    </div>
  );
}

export default App;
