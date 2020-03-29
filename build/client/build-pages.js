const glob = require("glob");
const fs = require("fs");
const htmlMinifier = require("html-minifier");

fs.mkdirSync("dist/client", { recursive: true });

const pages = glob.sync("src/client/*.html");
pages.forEach((page) => {
  let html = fs.readFileSync(page, "UTF8");
  html = htmlMinifier.minify(html, { collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: true });
  fs.writeFileSync(page.replace("src", "dist"), html);
});
