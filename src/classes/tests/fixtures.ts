import { Bank, CorrespondentBank } from "../classes";
import { commercialAssets, commercialLiabilities } from "../fixtures";

type Banks = {
  newBank: Bank;
  hsbc: CorrespondentBank;
  barclays: CorrespondentBank;
}

export function createBanks(): Banks {
  const newBank = new Bank(
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
  }
}