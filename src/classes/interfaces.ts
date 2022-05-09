//serious flaws
import { Bank, CommercialBank, Customer, ClearingHouse } from "./classes";

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
export const customerAssets = {
  customerDeposits: [],
};
export const customerLiabilities = {
  customerOverdrafts: [],
  customerLoans: [],
};
export const balances = {
  bankDeposits: [],
  bankLoans: [],
  customerLoans: [],
  customerDeposits: [],
  chCertificates: [],
};

export const createBank = () => ({
  customer(name: string, balance: number) {},
  bank() {},
});
interface BankObj {
  [index: string]: CommercialBank;
}
interface CustomerObj {
  [index: string]: Customer;
}

function createBanks() {}

const banks: BankObj = {};
const customers: CustomerObj = {};

function createBanksAndTheirCustomers(numBanks: number, numCustomers: number) {
  for (let i = 0; i < numBanks; i++) {
    banks[`bank${i}`] = new CommercialBank(
      `${i}`,
      { ...commercialAssets },
      { ...commercialLiabilities },
      { ...balances }
    );
    for (let j = 0; j < numCustomers; j++) {
      customers[`customer${i}${j}`] = new Customer(
        `${i}${j}`,
        { ...customerAssets },
        { ...customerLiabilities },
        { ...balances }
      );
      Bank.createSubordinateAccount(
        customers[`customer${i}${j}`],
        banks[`bank${i}`],
        1000,
        "customerDeposits",
        "customerOverdrafts"
      );
    }
  }
}

function createCorrespondingBankAccounts(numBanks: number) {
  for (let i = 0; i < numBanks; i++) {
    for (let k = i; k < numBanks - 1; k++) {
      Bank.createCorrespondingAccounts(
        banks[`bank${i}`],
        banks[`bank${k + 1}`],
        1000,
        "bankDeposits",
        "bankOverdrafts"
      );
    }
  }
}

function shareCustomerDetails(number: number) {
  // for (let first = 0; first < number; first++) {
  //   for (let second = 0; second < number; second++) {
  //     for (let third = 0; third < number; third++) {
  //       for (let fourth = 0; fourth < number; fourth++) {
  //         if (`${first}${second}` === `${third}${fourth}`) {
  //           continue;
  //         }
  //         Customer.shareDetails(
  //           customers[`customer${first}${second}`],
  //           customers[`customer${third}${fourth}`],
  //           banks[`bank${first}`]
  //         );
  //       }
  //     }
  //   }
  // }
  
  let customersArray: Customer[] = []
  const customerIds = []
  for (const customer in customers) {
    customersArray.push(customers[customer])
    customerIds.push(customers[customer].id)
  }
  for (let i = 0; i < customersArray.length - 1; i += 1) {
    //                                ^^^
      for (let j = i + 1; j < customersArray.length; j += 1) {
    //             ^^^^^
       Customer.giveDetails(customersArray[i], customersArray[j], banks[1])
    }
  }
}

export const clearingHouseSystem1 = () => ({
  create(numBanks: number, numCustomers: number) {
    createBanksAndTheirCustomers(numBanks, numCustomers);
    createCorrespondingBankAccounts(numBanks);
    shareCustomerDetails(numCustomers);
    return [banks, customers];
  },
  dailyTransfers(customers: CustomerObj) {
    let numCustomers = 0;
    let customersArray: Customer[] = []
    const customerIds = []
    for (const customer in customers) {
      numCustomers++;
      customersArray.push(customers[customer])
      customerIds.push(customers[customer].id)
    }
    
    // console.log(customerIds)
    Customer.getLookupTable()
    // for (let i = 0; i < numCustomers; i++) {
    //   const randomCustomerIndex = Math.floor(Math.random() * numCustomers);
      
    //   if (i !== randomCustomerIndex) {
    //     console.log(customersArray[i].id, customersArray[randomCustomerIndex].id)
    //     Customer.transfer(customersArray[i], customersArray[randomCustomerIndex], 50)
    //   }
    // }
  },
});

export const clearingHouseUserInterface1 = () => ({});
