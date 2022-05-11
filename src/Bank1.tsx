// import { useState } from "react";
// import "./App.css";
// import BankComponent from "./components/ui/BankComponent";
// import { Customer, CommercialBank, ClearingHouse } from "./classes/instances";
// import { System } from "./classes/systems";
// import {
//   CustomerService,
//   BankService,
//   ClearingHouseService,
// } from "./classes/services";
// import { PaymentMethods } from "./classes/methods";
// import CustomerComponent from "./components/ui/CustomerComponent";
// import ClearingHouseComponent from "./components/ui/ClearingHouseComponent";

// System.setSystem("clearinghouse");
// const clearinghouse = new ClearingHouse("clearinghouse");
// const bank1 = new CommercialBank("Bank1");
// const bank2 = new CommercialBank("Bank2");
// const customer1 = new Customer("CUSTOMER1");
// const customer2 = new Customer("CUSTOMER2");
// ClearingHouseService.openAccount(bank1, clearinghouse);
// ClearingHouseService.openAccount(bank2, clearinghouse);
// CustomerService.openAccount(customer1, bank1);
// CustomerService.openAccount(customer2, bank2);
// BankService.openAccount(bank1, bank2);
// BankService.openAccount(bank2, bank1);

// function App() {
//   const [num, setNum] = useState<number>(0);

//   function doStuff() {
//     CustomerService.deposit(customer1, bank1, 100);
//     CustomerService.deposit(customer2, bank2, 100);
//     CustomerService.transfer(customer1, customer2, 10);
//     CustomerService.transfer(customer1, customer2, 20);
//     CustomerService.transfer(customer2, customer1, 30);
//     CustomerService.transfer(customer2, customer1, 40);
//     BankService.netDues(bank1);
//     BankService.netDues(bank2);
//     PaymentMethods.settleDues();
//     setNum(num + 1);
//   }

//   function transfer(customerA: Customer, customerD: Customer) {
//     CustomerService.transfer(customerA, customerD, 50);
//     setNum(num + 1);
//   }
//   function deposit(customerA: Customer, bankA: Customer) {
//     CustomerService.deposit(customerA, bankA, 50);
//     setNum(num + 1);
//   }
//   function netDues() {
//     BankService.netDues(bank1);
//     BankService.netDues(bank2);
//     setNum(num + 1);
//   }
//   function settleDues() {
//     PaymentMethods.settleDues();
//     setNum(num + 1);
//   }

//   const banks = [bank1, bank2];
//   const customers = [customer1, customer2];

//   const BankComponents = [bank1, bank2].map((bank) => (
//     <BankComponent bank={bank} netDues={netDues} />
//   ));
//   const CustomerComponents = customers.map((customer) => {
//     const otherCustomers = customers.filter((c) => c.id !== customer.id);
//     const bank = banks.filter((b) => b.accounts[0].id === customer.id);
//     return (
//       <CustomerComponent
//         customer1={customer}
//         customer2={otherCustomers[0]}
//         bank1={bank[0]}
//         transfer={transfer}
//         deposit={deposit}
//       />
//     );
//   });

//   return (
//     <div>
//       <div style={{ display: "flex", flexDirection: "row" }}>
//         <ClearingHouseComponent bank={clearinghouse} settleDues={settleDues} />
//         {BankComponents.map((bank) => {
//           return bank;
//         })}
//         {CustomerComponents.map((customer) => {
//           return customer;
//         })}
//       </div>
//       <button onClick={doStuff}>Do Stuff</button>
//     </div>
//   );
// }

// export default App;

export default function Bla() {
  return <h1>hello</h1>
}