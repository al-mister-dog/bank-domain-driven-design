import { ClearingHouse, CommercialBank, Customer } from "../classes/instances";
import {
  ClearingHouseService,
  CustomerService,
  BankService,
} from "../classes/services";
import { System } from "../classes/systems";

// System.setSystem("clearinghouse");
// const clearinghouse = new ClearingHouse("clearinghouse");
// const bank1 = new CommercialBank("Bank1");
// const bank2 = new CommercialBank("Bank2");
// const customer1 = new Customer("CUSTOMER1");
// const customer2 = new Customer("CUSTOMER2");
// ClearingHouseService.openAccount(bank1, clearinghouse, 1000);
// ClearingHouseService.openAccount(bank2, clearinghouse, 1000);
// CustomerService.openAccount(customer1, bank1);
// CustomerService.openAccount(customer2, bank2);
// BankService.openAccount(bank1, bank2);
// BankService.openAccount(bank2, bank1);

function clearinghouseSystem() {
  System.setSystem("clearinghouse");
  const clearinghouse = new ClearingHouse("clearinghouse");
  const bank1 = new CommercialBank("Bank1");
  const bank2 = new CommercialBank("Bank2");
  const customer1 = new Customer("CUSTOMER1");
  const customer2 = new Customer("CUSTOMER2");
  ClearingHouseService.openAccount(bank1, clearinghouse, 1000);
  ClearingHouseService.openAccount(bank2, clearinghouse, 1000);
  CustomerService.openAccount(customer1, bank1);
  CustomerService.openAccount(customer2, bank2);
  BankService.openAccount(bank1, bank2);
  BankService.openAccount(bank2, bank1);
  return { clearinghouse, bank1, bank2, customer1, customer2 };
}

export { clearinghouseSystem };
