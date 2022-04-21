import { Bank, CommercialBank, CorrespondentBank, Customer } from "../classes";
import { commercialAssets, commercialLiabilities, balances } from "../fixtures";

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
type Banks3 = {
  hsbc: CommercialBank;
  barclays: CommercialBank;
  johnDoe: Customer;
  janeDoe: Customer;
};
export function createCorrespondentBanks(): Banks1 {
  const newBank = new CommercialBank(
    "1",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    0
  );
  const hsbc = new CorrespondentBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
  );
  const barclays = new CorrespondentBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
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
    { ...commercialLiabilities },
    { ...balances },
  );
  const barclays = new CommercialBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
  );
  const johnDoe = new Customer(
    "JOHN_DOE",
    { customerDeposits: [{ id: "ID", amount: 0 }] },
    { customerOverdrafts: [{ id: "ID", amount: 0 }] },
    { ...balances },
  );
  return {
    hsbc,
    barclays,
    johnDoe,
  };
}

export function createInterBank(): Banks3 {
  const hsbc = new CommercialBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
  );
  const barclays = new CommercialBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
  );
  const johnDoe = new Customer(
    "JOHN_DOE",
    { customerDeposits: [{ id: "ID", amount: 0 }] },
    { customerOverdrafts: [{ id: "ID", amount: 0 }] },
    { ...balances },
  );
  const janeDoe = new Customer(
    "JANE_DOE",
    { customerDeposits: [{ id: "ID", amount: 0 }] },
    { customerOverdrafts: [{ id: "ID", amount: 0 }] },
    { ...balances },
  );
  return {
    hsbc,
    barclays,
    johnDoe,
    janeDoe,
  };
}