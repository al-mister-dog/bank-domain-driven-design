export const commercialAssets = {
  bankDeposits: [],
  bankOverdrafts: [],
  bankLoans: [],
  customerOverdrafts: [],
  chCertificates: [],
  chOverdrafts: [],
  customerLoans: [],
  dues: [],
};

export const commercialLiabilities = {
  bankDeposits: [],
  bankOverdrafts: [],
  bankLoans: [],
  customerDeposits: [],
  chCertificates: [],
  chOverdrafts: [],
  customerLoans: [],
  dues: [],
};

export const commercialBalances = {
  bankDeposits: [],
  customerDeposits: [],
  chCertificates: [],
};

export const customerAssets = { customerDeposits: [] };

export const customerLiabilities = {
  customerOverdrafts: [],
  customerLoans: [],
};

export const customerBalances = { customerDeposits: [] };

export const clearinghouseAssets = {
  chOverdrafts: [],
  dues: [],
};

export const clearinghouseLiabilities = {
  chCertificates: [],
  dues: [],
};

export const clearinghouseBalances = {
  chCertificates: [],
};

export const exchangeBankAssets = {
  bankDeposits: [],
  bankOverdrafts: [],
  billsOfExchange: [],
  currency: [],
};

export const exchangeBankLiabilities = {
  bankDeposits: [],
  bankOverdrafts: [],
  billsOfExchange: [],
  currency: [],
};

export const exchangeBankAccounts = {
  nostro: [], //our account in their bank and their currency
  vostro: [], //their account in our bank and in our currency
};

export const exchangeBankBalances = {
  bankDeposits: [],
};

export const traderAssets = {
  billsOfExchange: []
}

export const traderLiabilities = {
  billsOfExchange: []
}