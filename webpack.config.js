const path = require("path");
const webpack = require("webpack");
const fableUtils = require("fable-utils");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const nodemonPlugin = require('nodemon-webpack-plugin');

function resolve(filePath) {
    return path.join(__dirname, filePath)
}

var babelOptions = fableUtils.resolveBabelOptions({
    presets: [
        [
            // "es2015", {
            //     "modules": false
            // }
            "env",
            {
                "targets": {
                    "node": "6" // "browsers": ["last 2 versions"]
                },
                "modules": "commonjs"
            }
        ]
    ]
});

var isProduction = process.argv.indexOf("-p") >= 0;
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

var commonPlugins = [
    new HtmlWebpackPlugin({
        filename: resolve('./public/index.html'),
        template: resolve('./src/Client/index.html')
    })
];

var basicConfig = {
    devtool: "source-map",
    resolve: {
        modules: [
            resolve("./node_modules/")
        ]
    },
    mode: isProduction ? "production" : "development",
    module: {
        rules: [{
                test: /\.fs(x|proj)?$/,
                use: {
                    loader: "fable-loader",
                    options: {
                        babel: babelOptions,
                        define: isProduction ? [] : ["DEBUG"],
                        extra: {
                            optimizeWatch: true
                        }
                    },
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                },
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                use: ["file-loader"]
            }
        ]
    }
};

let clientConfig = Object.assign({
    entry: isProduction ? // We don't use the same entry for dev and production, to make HMR over style quicker for dev env
        {
            demo: [
                "babel-polyfill",
                resolve('./src/Client/Client.fsproj'),
                resolve('./src/Client/scss/main.scss')
            ]
        } : {
            app: [
                "babel-polyfill",
                resolve('./src/Client/Client.fsproj')
            ],
            style: [
                resolve('./src/Client/scss/main.scss')
            ]
        },
    output: {
        path: resolve('./public'),
        filename: isProduction ? '[name].[hash].js' : '[name].js'
    },
    plugins: isProduction ?
        commonPlugins.concat([
            new MiniCssExtractPlugin({
                filename: 'style.css'
            }),
            new CopyWebpackPlugin([{
                from: './static'
            }])
        ]) : commonPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        ]),
    resolve: {
        modules: [
            "node_modules/",
            resolve("./node_modules/")
        ]
    },
    devServer: {
        contentBase: resolve('./static/'),
        publicPath: "/",
        port: 8080,
        hot: true,
        inline: true
    }
}, basicConfig);

// let functionsConfig = Object.assign({
//     target: "node",
//     node: {
//         __filename: false,
//         __dirname: false
//     },
//     externals: [nodeExternals()],
//     entry: resolve("src/Firebase.Functions/Fable.Import.Firebase.Functions.fsproj"),
//     output: {
//         path: resolve("public/test/"),
//         filename: "server.js"
//     },
//     plugins: [
//         new nodemonPlugin()
//     ],
//     optimization: {
//         minimize: false
//     }
// }, basicConfig);

let serverConfig = Object.assign({
    target: "node",
    node: {
        __filename: false,
        __dirname: false
    },
    externals: [nodeExternals()],
    entry: resolve("src/Server/Server.fsproj"),
    output: {
        path: resolve("functions/"),
        filename: "index.js"
    },
    plugins: [
        new nodemonPlugin()
    ],
    optimization: {
        minimize: false
    }
}, basicConfig);

console.log("Clientconfig:", clientConfig)
console.log("serverConfig:", serverConfig)

module.exports = [serverConfig]