import { Customer, Bank } from "../../classes/instances";
import BalanceSheet from "./BalanceSheet";
import SelectedCustomer from "./SelectedCustomer";

const CustomerComponent: React.FunctionComponent<{
  customer1: Customer;
  customer2: Customer;
  bank1: Bank;
  transfer: (customer1: Customer, customer2: Customer) => void;
  deposit: (customer1: Customer, bank1: Bank) => void;
  selectCustomer: (customer: Customer) => void;
}> = ({ customer1, customer2, bank1, transfer, deposit, selectCustomer }) => {
  return (
    <div
      style={{
        background: "#e1e4f7",
        border: "1px solid gray",
        borderRadius: "5px",
        margin: "10px",
        padding: "10px",
      }}
      onClick={() => selectCustomer(customer1)}
    >
      <button onClick={() => transfer(customer1, customer2)}>Transfer</button>
      <button onClick={() => deposit(customer1, bank1)}>Deposit</button>
      <BalanceSheet bank={customer1} />
    </div>
  );
};

export default CustomerComponent;
