const path = require("path");
const fableUtils = require("fable-utils");

function resolve(relativePath) {
    return path.join(__dirname, relativePath);
}

module.exports = {
    entry: resolve("src/Server/Server.fsproj"),
    outDir: resolve("functions"),
    babel: fableUtils.resolveBabelOptions({
        presets: [
            ["env", {
                modules: "commonjs"
            }]
        ],
        sourceMaps: true,
    }),
    fable: {
        define: ["DEBUG"]
    }
}