const account = { id: "id", amount: 0 };

export const commercialAssets = {
  bankDeposits: [{ ...account }],
  bankOverdrafts: [{ ...account }],
  bankLoans: [{ ...account }],
  customerOverdrafts: [{ ...account }],
  dues: [{ ...account }],
};
export const commercialLiabilities = {
  bankDeposits: [{ ...account }],
  bankOverdrafts: [{ ...account }],
  bankLoans: [{ ...account }],
  customerDeposits: [{ ...account }],
  dues: [{ ...account }],
};
export const balances = {
  bankDeposits: [{ ...account }],
  bankLoans: [{ ...account }],
  customerDeposits: [{ ...account }],
}