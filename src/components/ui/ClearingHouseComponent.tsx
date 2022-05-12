import { ClearingHouse } from "../../classes/instances";
import BalanceSheet from "./BalanceSheet";

const ClearingHouseComponent: React.FunctionComponent<{
  bank: ClearingHouse;
  settleDues: () => void;
}> = ({ bank, settleDues }) => {
  return (
    <div style={{background: "#f0fcf3", border: "1px solid gray", borderRadius: "5px", margin: "10px", padding: "10px"}}>
      <h3>{bank.id}</h3>
      <button onClick={settleDues}>Settle Dues</button>
      <BalanceSheet bank={bank} />
    </div>
  );
};

export default ClearingHouseComponent;
