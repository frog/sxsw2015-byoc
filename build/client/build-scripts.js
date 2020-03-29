const fs = require("fs");
const execSync = require("npm-run").execSync;

fs.mkdirSync("dist/client/scripts", { recursive: true });

execSync("rollup -c");