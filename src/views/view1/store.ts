import {
  ClearingHouse,
  CommercialBank,
  Customer,
} from "../../classes/instances";
import {
  ClearingHouseService,
  CustomerService,
  BankService,
} from "../../classes/services";
import { System } from "../../classes/systems";

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

function correspondentSystemSimple() {
  System.setSystem("correspondent");
  const bank1 = new CommercialBank("Bank1");
  const bank2 = new CommercialBank("Bank2");
  const customer1 = new Customer("CUSTOMER1");
  const customer2 = new Customer("CUSTOMER2");
  return { bank1, bank2, customer1, customer2 };
}

function correspondentSystemManyToMany() {
  System.setSystem("correspondent");
  const bank1 = new CommercialBank("Bank1");
  const bank2 = new CommercialBank("Bank2");
  const bank3 = new CommercialBank("Bank3");
  const bank4 = new CommercialBank("Bank4");
  const customer1 = new Customer("CUSTOMER1");
  const customer2 = new Customer("CUSTOMER2");
  const customer3 = new Customer("CUSTOMER3");
  const customer4 = new Customer("CUSTOMER4");
  const banks = [bank1, bank2, bank3, bank4];
  const customers = [customer1, customer2, customer3, customer4];
  for (let i = 0; i < banks.length - 1; i += 1) {
    for (let j = i + 1; j < banks.length; j += 1) {
      BankService.openAccount(banks[i], banks[j]);
    }
  }
  customers.forEach((c) => {
    for (let i = 0; i < banks.length; i++) {
      CustomerService.openAccount(c, banks[i]);
    }
  });
  return {
    customer1,
    customer2,
    customer3,
    customer4,
    bank1,
    bank2,
    bank3,
    bank4,
  };
}

export {
  clearinghouseSystem,
  correspondentSystemSimple,
  correspondentSystemManyToMany,
};
