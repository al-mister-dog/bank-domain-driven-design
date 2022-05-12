import { Customer } from "../../classes/instances";
import BalanceSheet from "./BalanceSheet";

const CustomerSelect: React.FunctionComponent<{
  customer: Customer;
  selectCustomer: (customer: Customer) => void;
}> = ({ customer, selectCustomer }) => {
  return (
    <div
      style={{
        background: "#e1e4f7",
        border: "1px solid gray",
        borderRadius: "5px",
        margin: "10px",
        padding: "10px",
      }}
      onClick={() => selectCustomer(customer)}
    >
      <h3>{customer.id}</h3>
      <BalanceSheet bank={customer} />
    </div>
  );
};

export default CustomerSelect;
