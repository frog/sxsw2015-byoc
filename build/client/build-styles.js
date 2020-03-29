const fs = require("fs");
const execSync = require("npm-run").execSync;

fs.mkdirSync("dist/client/styles", { recursive: true });

execSync("postcss src/client/styles/*.css --dir dist/client/styles --map --verbose");