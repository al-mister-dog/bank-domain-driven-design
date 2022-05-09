import { IBank } from "../../classes/classes2";
const BalanceSheet = ({ bank }: { bank: IBank }) => {
  return (
    <div>
      <h3>{bank.id}</h3>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column", marginRight: "10px" }}>
          <h4>Assets</h4>
          {Object.entries(bank.assets)
            .filter(([assetType, assetArray], i) => assetArray.length > 0)
            .map(([assetType, assetArray], i) => {
              return (
                <div key={i}>
                  <h5>{assetType}</h5>
                  {assetArray.map((ob) => (
                    <h6 key={ob.id}>
                      <span>{ob.id}: </span>
                      <span>{ob.amount}</span>
                    </h6>
                  ))}
                </div>
              );
            })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
        <h4>Liabilities</h4>
          {Object.entries(bank.liabilities)
            .filter(([assetType, assetArray], i) => assetArray.length > 0)
            .map(([assetType, assetArray], i) => {
              return (
                <div key={i}>
                  <h5>{assetType}</h5>
                  {assetArray.map((ob) => (
                    <h6 key={ob.id}>
                      <span>{ob.id}: </span>
                      <span>{ob.amount}</span>
                    </h6>
                  ))}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
