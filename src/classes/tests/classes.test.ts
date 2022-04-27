import "@testing-library/jest-dom";
import {createCorrespondentBanks} from './testFixtures'


describe("parent class instance", () => {
  it("should have four properties", () => {
    // const {newBank} = createCorrespondentBanks()
    // expect(Object.keys(newBank)).toEqual([
    //   "id",
    //   "assets",
    //   "liabilities",
    //   "balances",
    //   "reserves",
    //   "clearingHouseMember"
    // ]);
  });
  it("has correct property types", () => {
    const {newBank} = createCorrespondentBanks()
    expect(typeof newBank.id).toBe("string");
    expect(typeof newBank.assets).toBe("object");
    expect(typeof newBank.liabilities).toBe("object");
  });
});
