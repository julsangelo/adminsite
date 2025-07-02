let path = require("path");
let Dotenv = require('dotenv-webpack');
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let { WebpackManifestPlugin } = require("webpack-manifest-plugin");

let isProduction = process.env.NODE_ENV == "production";
let stylesHandler = isProduction ? MiniCssExtractPlugin.loader : "style-loader";

let config = {
    entry: {
        bundle: path.resolve(__dirname, "resources/frontend/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "public/assets"),
        publicPath: "/",
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs|cjs)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.module.scss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: `[name]-[local]-[hash:base64:5]`,
                                namedExport: false,
                            },
                            sourceMap: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                type: "asset/resource",
                generator: {
                    filename: "[name][ext]",
                },
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif|webm|webp)$/,
                type: "asset/resource",
                generator: {
                    filename: "images/[name][ext]",
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new Dotenv(),
        new WebpackManifestPlugin({
            fileName: path.resolve(__dirname, "manifest.json"),
            generate: (seed, files) => {
                let manifest = files.reduce((acc, { path, name }) => {
                    let ext = path.split(".").pop();
                    if (ext == "js" || ext == "css") {
                        if (!acc[ext]) {
                            acc[ext] = {};
                        }
                        acc[ext][name] = path;
                    }
                    return acc;
                }, seed);
                return { main: manifest };
            },
        }),
    ],
    resolve: {
        extensions: [".js", ".scss"],
        alias: {
            "@assets": path.resolve(__dirname, "resources/frontend/assets"),
        },
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";

        config.plugins.push(new MiniCssExtractPlugin());
    } else {
        config.mode = "development";
    }
    return config;
};
