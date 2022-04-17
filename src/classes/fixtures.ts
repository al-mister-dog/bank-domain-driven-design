const account = { id: "id", amount: 0 };

export const commercialAssets = {
  bankDeposits: [{ ...account }],
  bankLoans: [{ ...account }],
  customerOverdrafts: [{ ...account }],
};
export const commercialLiabilities = {
  bankDeposits: [{ ...account }],
  bankLoans: [{ ...account }],
  customerDeposits: [{ ...account }],
};