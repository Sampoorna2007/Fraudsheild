const { spawn } = require("child_process");
const path = require("path");

function detectAnomalyWithPython(transaction) {
  return new Promise((resolve, reject) => {
    const pythonFile = path.join(__dirname, "isolationForest.py");

    const python = spawn("python", [
      pythonFile,
      JSON.stringify(transaction)
    ]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(errorOutput));
        return;
      }

      try {
        const lines = output.trim().split("\n");
        const result = JSON.parse(lines[lines.length - 1]);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = {
  detectAnomalyWithPython
};
