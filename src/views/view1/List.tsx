import { CommercialBank, Customer, Bank } from "../../classes/instances";

const List: React.FunctionComponent<{
  banks: CommercialBank[];
  customers: Customer[];
  select: (b: Bank) => void;
}> = ({ banks, customers, select }) => {
  
  return (
    <>
      {banks.map((bank) => (
        <p key={bank.id}>{JSON.stringify(bank)}</p>
      ))}
      {customers.map((customer) => (
        <p key={customer.id} onClick={() => select(customer)}>
          {JSON.stringify(customer)}
        </p>
      ))}
    </>
  );
};

export default List;
