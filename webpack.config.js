const path = require("node:path");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

module.exports = {
    devtool: false,

    entry: path.resolve(__dirname, "./source/index.ts"),

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    },

    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./dist"),
        library: {
            type: "commonjs2"
        }
    },

    resolve: {
        // No .ts/.tsx included due to the typescript resolver plugin
        extensions: [".js", ".ts"],
        plugins: [
            // Handle .ts => .js resolution
            new ResolveTypeScriptPlugin()
        ]
    },

    target: "node"
};
