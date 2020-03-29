import glob from "glob";
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const scripts = glob.sync("src/client/scripts/*.ts");

export default scripts.map((file, index) => ({
  input: file,
  output: {
    dir: "dist/client/scripts",
    format: "iife",
    sourcemap: true
  },
  plugins: [
    alias({
      entries: {
        "vue": "node_modules/vue/dist/vue.js", // TODO: configure environment option for dev (.min) and production
        "socket.io-client": "node_modules/socket.io-client/dist/socket.io.slim.js"
      }
    }),
		resolve(),
		commonjs(),
    typescript(),
    //terser() //TODO: configure environment option for dev / production
  ]
}));
