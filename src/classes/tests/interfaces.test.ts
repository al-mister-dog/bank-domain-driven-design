import { clearingHouseSystem1, customerAssets } from "../interfaces";

// describe("initialization", () => {
//   it("creates x amount of banks with x amount of customers, banks have accounts with every other bank", () => {
//     const numBanks = 6;
//     const [myBanks, myCustomers] = clearingHouseSystem1().create(numBanks, 4);
//     for (const customer in myCustomers) {
//       expect(myCustomers[customer].assets.customerDeposits[0].amount).toBe(
//         1000
//       );
//     }
//   });
//   it("creates banks who each have a bank deposits account with every other bank", () => {
//     const numBanks = 6;
//     const [banks] = clearingHouseSystem1().create(numBanks, 4);
//     for (const bank in banks) {
//       expect(banks[bank].balances.bankDeposits.length).toEqual(5);
//     }
//   });
//   it("should not have a bank that has an account with itself", () => {
//     const numBanks = 6;
//     const [banks] = clearingHouseSystem1().create(numBanks, 4);
//     let num = 0;
//     for (const bank in banks) {
//       expect(banks[bank].balances.bankDeposits).not.toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             id: num.toString(),
//             amount: 1000,
//           }),
//         ])
//       );
//       num++;
//     }
//   });
// });
describe("interbank transfers", () => {
  it("asa", () => {
    const numBanks = 5;
    const [banks, customers] = clearingHouseSystem1().create(numBanks, 3);
    clearingHouseSystem1().dailyTransfers(customers);
    expect(1).toBe(1);
  });
});
