const glob = require("glob");
const fs = require("fs");
const path = require("path");
const svgstore = require("svgstore");

fs.mkdirSync("dist/client/graphics", { recursive: true });

const outputs = [
  { name: "common", source: "src/client/graphics/*.svg" }
]

const folders = fs.readdirSync("src/client/graphics", { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
folders.forEach((folder) => {
  outputs.push({ name: folder, source: `src/client/graphics/${folder}/*.svg` });
});

outputs.forEach((output) => {
  const store = svgstore();
  const svgs = glob.sync(output.source);
  svgs.forEach((svg) => {
    store.add(path.basename(svg).replace(".svg", ""), fs.readFileSync(svg, "UTF8"));
  });
  fs.writeFileSync(`dist/client/graphics/${output.name}.svg`, store.toString());
});
