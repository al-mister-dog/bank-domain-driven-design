import { IBank } from "../../classes/types";
import BalanceSheet from "./BalanceSheet";

const BankComponent: React.FunctionComponent<{
  bank: IBank,
  netDues: () => void;
}> = ({bank, netDues}) => {
  return (
    <div style={{background: "#fcf3f0", border: "1px solid gray", borderRadius: "5px", margin: "10px", padding: "10px"}}>
      <h3>{bank.id}</h3>
      <button onClick={netDues}>Net Dues</button>
      <BalanceSheet bank={bank} />
    </div>
  );
};

export default BankComponent;
