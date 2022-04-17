import { commercialAssets, commercialLiabilities } from "./fixtures";
import Bank from "./classes";

const hsbc = new Bank(
  new Date().toISOString(),
  { ...commercialAssets },
  { ...commercialLiabilities }
);

const barclays = new Bank(
  new Date().toISOString(),
  { ...commercialAssets },
  { ...commercialLiabilities }
);
