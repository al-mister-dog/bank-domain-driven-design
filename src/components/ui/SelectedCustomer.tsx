import { Bank, Customer } from "../../classes/instances";
import { customer1, customer2, bank1 } from "../../fixtures/clearinghouse";
import BalanceSheet from "./BalanceSheet";

const SelectedCustomer: React.FunctionComponent<{
  customer: Customer;
  customers: Customer[];
  banks: Bank[];
  transfer: (customer1: Customer, customer2: Customer) => void;
  deposit: (customer1: Customer, bank1: Bank) => void;
}> = ({ customer, customers, banks, transfer, deposit }) => {
  const otherCustomers = customers.filter((c) => c.id !== customer.id)
  console.log(JSON.stringify(otherCustomers[0]))
  return (
    <>
      <div
        style={{
          background: "#e1e4f7",
          border: "1px solid gray",
          borderRadius: "5px",
          margin: "10px",
          padding: "10px",
        }}
      >
        <h3>{customer.id}</h3>
        <button onClick={() => transfer(customer1, customer2)}>Transfer</button>
        <button onClick={() => deposit(customer1, bank1)}>Deposit</button>
        <BalanceSheet bank={customer} />
      </div>
    </>
  );
};
export default SelectedCustomer;
