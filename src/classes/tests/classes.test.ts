import "@testing-library/jest-dom";
import {createBanks} from './fixtures'


describe("parent class instance", () => {
  it("should have four properties", () => {
    const {newBank} = createBanks()
    expect(Object.keys(newBank)).toEqual([
      "id",
      "assets",
      "liabilities",
      "reserves",
    ]);
  });
  it("has correct property types", () => {
    const {newBank} = createBanks()
    expect(typeof newBank.id).toBe("string");
    expect(typeof newBank.assets).toBe("object");
    expect(typeof newBank.liabilities).toBe("object");
    expect(typeof newBank.reserves).toBe("number");
  });
});
