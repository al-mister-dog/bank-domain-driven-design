const exchangeRates = {
  florence: 66,
  lyons: 64,
};

const certaintyQuotes = {
  florence: false,
  lyons: true,
};

const importerA = {
  id: "importerA",
  city: "lyons",
  assets: [],
  liabilities: [],
  reserves: 100,
  goods: 10,
};
const exporterA = {
  id: "exporterA",
  city: "florence",
  assets: [],
  liabilities: [],
  reserves: 100,
  goods: 10,
};
const importerB = {
  id: "importerB",
  city: "florence",
  assets: [],
  liabilities: [],
  reserves: 100,
  goods: 10,
};
const exporterB = {
  id: "exporterB",
  city: "lyons",
  assets: [],
  liabilities: [],
  reserves: 100,
  goods: 10,
};
const bankA = {
  id: "bankA",
  city: "florence",
  assets: [],
  liabilities: [],
  exchangeUnit: 10,
  reserves: 500,
};
const bankB = {
  id: "bankB",
  city: "lyons",
  assets: [],
  liabilities: [],
  exchangeUnit: 10,
  reserves: 500,
};

// const city1 = bankA.city
// const city2 = bankB.city

// console.log(exchangeRates[city1])
// console.log(exchangeRates[city2])

function trade(importer, exporter, amount) {
  const date = new Date().toISOString();
  const bill = {
    id: date,
    dueTo: exporter.id,
    dueFrom: importer.id,
    city: importer.city,
    amount: amount,
  };
  importer.liabilities = [...importer.liabilities, bill];
  importer.goods = amount;
  exporter.assets = [...exporter.assets, bill];
}

function drawBill(bearer, exchangeBank, presentedBill) {
  if (presentedBill.dueTo === bearer.id) {
    const bill = bearer.assets.find((b) => b.id === presentedBill.id);
    bearer.assets = exchangeBank.assets.filter(
      (b) => b.id !== presentedBill.id
    );
    exchangeBank.assets = [...exchangeBank.assets, bill];
    makeExchange(bearer, exchangeBank, bill);
  }
}

function makeExchange(bearer, exchangeBank, bill) {
  const cityQuotesCertain = certaintyQuotes[exchangeBank.city];
  if (cityQuotesCertain) {
    exchangeBank.exchangeUnit -= bill.amount;
    bearer.reserves += bill.amount * exchangeRates[exchangeBank.city];
  } else {
    exchangeBank.reserves -= bill.amount * exchangeRates[bill.city];
    bearer.reserves += bill.amount * exchangeRates[bill.city];
  }
}

function remitBill(presenter, presentee, presentedBill) {
  const bill = presenter.assets.find((b) => b.id === presentedBill.id);
  presenter.assets = presenter.assets.filter((b) => b.id !== presentedBill.id);
  presentee.assets = [...presentee.assets, bill];
}

function presentBill(exchangeBank, payee, presentedBill) {
  const bill = exchangeBank.assets.find((b) => b.id === presentedBill.id);
  if (presentedBill.dueFrom === payee.id) {
    exchangeBank.assets = exchangeBank.assets.filter(
      (b) => b.id !== presentedBill.id
    );
    payee.liabilities = payee.liabilities.filter(
      (b) => b.id !== presentedBill.id
    );
    const cityQuotesCertain = certaintyQuotes[exchangeBank.city];
    if (cityQuotesCertain) {
      exchangeBank.exchangeUnit += bill.amount;
      payee.reserves -= bill.amount * exchangeRates[exchangeBank.city];
    } else {
      exchangeBank.reserves += bill.amount * exchangeRates[bill.city];
      payee.reserves -= bill.amount * exchangeRates[bill.city];
    }
  }
}

trade(importerA, exporterA, 1);
drawBill(exporterA, bankA, exporterA.assets[0]);
remitBill(bankA, bankB, bankA.assets[0]);
presentBill(bankB, importerA, bankB.assets[0]);
trade(importerB, exporterB, 1);
drawBill(exporterB, bankB, exporterB.assets[0]);
remitBill(bankB, bankA, bankB.assets[0]);
presentBill(bankA, importerB, bankA.assets[0]);
