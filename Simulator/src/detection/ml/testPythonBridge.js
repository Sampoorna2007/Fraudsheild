const { detectAnomalyWithPython } = require("./pythonBridge");

const transaction = {
  amount: 50000,
  hour: 2,
  velocity: 8,
  locationChange: 1
};

detectAnomalyWithPython(transaction)
  .then((result) => {
    console.log("\n===== NODE → PYTHON TEST =====\n");
    console.log(result);
  })
  .catch((error) => {
    console.error("\nPython bridge error:");
    console.error(error.message);
  });