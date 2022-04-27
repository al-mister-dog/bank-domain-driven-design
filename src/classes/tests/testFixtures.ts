import { CommercialBank, Customer } from "../classes";
import { commercialAssets, commercialLiabilities, balances } from "../fixtures";

export function createCorrespondentBanks() {
  const newBank = new CommercialBank(
    "1",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances },
    0
  );
  const hsbc = new CommercialBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const barclays = new CommercialBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  return {
    newBank,
    hsbc,
    barclays,
  };
}

export function createCommercialBanks() {
  const hsbc = new CommercialBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const barclays = new CommercialBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const johnDoe = new Customer(
    "JOHN_DOE",
    { customerDeposits: [] },
    { customerOverdrafts: [] },
    { ...balances }
  );
  return {
    hsbc,
    barclays,
    johnDoe,
  };
}

export function createInterBank() {
  const hsbc = new CommercialBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const barclays = new CommercialBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const johnDoe = new Customer(
    "JOHN_DOE",
    { customerDeposits: [] },
    { customerOverdrafts: [] },
    { ...balances }
  );
  const janeDoe = new Customer(
    "JANE_DOE",
    { customerDeposits: [] },
    { customerOverdrafts: [] },
    { ...balances }
  );
  return {
    hsbc,
    barclays,
    johnDoe,
    janeDoe,
  };
}

export function clearingHouseSystem() {
  const clearingHouse = new CommercialBank(
    "CLEARINGHOUSE",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const santander = new CommercialBank(
    "SANTANDER",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const hsbc = new CommercialBank(
    "HSBC",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const barclays = new CommercialBank(
    "BARCLAYS",
    { ...commercialAssets },
    { ...commercialLiabilities },
    { ...balances }
  );
  const johnDoe = new Customer(
    "JOHN_DOE",
    { customerDeposits: [] },
    { customerOverdrafts: [] },
    { ...balances }
  );
  const janeDoe = new Customer(
    "JANE_DOE",
    { customerDeposits: [] },
    { customerOverdrafts: [] },
    { ...balances }
  );
  const bobSmith = new Customer(
    "BOB_SMITH",
    { customerDeposits: [] },
    { customerOverdrafts: [] },
    { ...balances }
  );
  return {
    clearingHouse,
    santander,
    hsbc,
    barclays,
    johnDoe,
    janeDoe,
    bobSmith,
  };
}
