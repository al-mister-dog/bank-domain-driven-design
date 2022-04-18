import { Bank, CommercialBank, CorrespondentBank, Customer } from "../classes";
import { commercialAssets, commercialLiabilities } from "../fixtures";

type Banks1 = {
  newBank: Bank;
  hsbc: CorrespondentBank;
  barclays: CorrespondentBank;
};
type Banks2 = {
  hsbc: CommercialBank;
  barclays: CommercialBank;
  johnDoe: Customer;
};
export function createCorrespondentBanks(): Banks1 {
  const newBank = new CommercialBank(
    "1",
    { ...commercialAssets },
    { ...commercialLiabilities },
    0
  );
  const hsbc = new CorrespondentBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities }
  );
  const barclays = new CorrespondentBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities }
  );
  return {
    newBank,
    hsbc,
    barclays,
  };
}

export function createCommercialBanks(): Banks2 {
  const hsbc = new CommercialBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities }
  );
  const barclays = new CommercialBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities }
  );
  const johnDoe = new Customer(
    "JOHN DOE",
    { customerDeposits: [{ id: "ID", amount: 0 }] },
    { customerOverdrafts: [{ id: "ID", amount: 0 }] }
  );
  return {
    hsbc,
    barclays,
    johnDoe,
  };
}
