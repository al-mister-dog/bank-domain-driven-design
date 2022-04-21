const account = { id: "id", amount: 0 };

export const commercialAssets = {
  bankDeposits: [{ ...account }],
  bankOverdrafts: [{ ...account }],
  bankLoans: [{ ...account }],
  customerOverdrafts: [{ ...account }],
};
export const commercialLiabilities = {
  bankDeposits: [{ ...account }],
  bankOverdrafts: [{ ...account }],
  bankLoans: [{ ...account }],
  customerDeposits: [{ ...account }],
};
export const balances = {
  bankDeposits: [{ ...account }],
  bankLoans: [{ ...account }],
  customerDeposits: [{ ...account }],
}