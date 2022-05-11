import { IBank } from "../../classes/types";
const BalanceSheet = ({ bank }: { bank: IBank }) => {
  return (
    <div>
      <h3>{bank.id}</h3>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column", marginRight: "10px", padding: "0px"}}>
          <h4 style={{margin: "0px", padding: "0px"}}>Assets</h4>
          {Object.entries(bank.assets)
            .filter(([assetType, assets], i) => assets.length > 0)
            .map(([assetType, assets], i) => {
              return (
                <div key={i} style={{margin: "0px", padding: "0px"}}>
                  <h5 style={{margin: "0px", padding: "0px"}}>{assetType}</h5>
                  {assets.map((account) => (
                    <h6 key={account.id} style={{margin: "0px", padding: "0px"}}>
                      <span>{account.id}: </span>
                      <span>{account.amount}</span>
                    </h6>
                  ))}
                </div>
              );
            })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginRight: "10px", padding: "0px"}}>
          <h4 style={{margin: "0px", padding: "0px"}}>Liabilities</h4>
          {Object.entries(bank.liabilities)
            .filter(([assetType, liabilities], i) => liabilities.length > 0)
            .map(([assetType, liabilities], i) => {
              return (
                <div key={i} style={{margin: "0px", padding: "0px"}}>
                  <h5 style={{margin: "0px", padding: "0px"}}>{assetType}</h5>
                  {liabilities.map((account) => (
                    <h6 key={account.id} style={{margin: "0px", padding: "0px"}}>
                      <span>{account.id}: </span>
                      <span>{account.amount}</span>
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
