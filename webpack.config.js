const path = require('path');

// Constantes
const DEV = process.env.NODE_ENV === "dev";
const WEB_DIR = path.resolve(__dirname, '../web');
const WEB_ELECTEUR_DIR = path.resolve(__dirname);
const DIST_FOLDER = path.resolve(WEB_DIR, 'src/main/webapp/includes/dist/');

// Charger les modules depuis web/node_modules
const ConcatPlugin = require(path.resolve(WEB_DIR, 'node_modules/@mcler/webpack-concat-plugin'));
const {CleanWebpackPlugin} = require(path.resolve(WEB_DIR, 'node_modules/clean-webpack-plugin'));
const MiniCssExtractPlugin = require(path.resolve(WEB_DIR, 'node_modules/mini-css-extract-plugin'));
const TerserPlugin = require(path.resolve(WEB_DIR, 'node_modules/terser-webpack-plugin'));
const {BundleAnalyzerPlugin} = require(path.resolve(WEB_DIR, 'node_modules/webpack-bundle-analyzer'));
const webpack = require(path.resolve(WEB_DIR, 'node_modules/webpack'));

const cryptoJsDependencies = require(path.resolve(WEB_DIR, "./src/main/webapp/includes/election/javascript/crypto-dependencies.js"));

let config = {
    context: WEB_DIR,
    mode: DEV ? 'development' : 'production',
    devtool: DEV ? 'source-map' : false,
    entry: {
        app: path.resolve(WEB_DIR, 'src/main/webapp/includes/election/javascript/vox-react/src/index.tsx'),
    },
    output: {
        path: path.join(DIST_FOLDER, 'election/'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    optimization: {
        minimize: !DEV,
        minimizer: [new TerserPlugin({
            extractComments: false,
            terserOptions: {
                // Options pour builds reproductibles
                mangle: {
                    keep_fnames: false,
                    keep_classnames: false,
                },
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                },
                output: {
                    comments: false,
                    beautify: false,
                },
            },
        })],
        chunkIds: 'deterministic',
        moduleIds: 'deterministic',
        mangleExports: 'deterministic',
    },
    experiments: {
        topLevelAwait: true
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|mjs|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/react', '@babel/preset-typescript'],
                        plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-syntax-top-level-await']
                    }
                }
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {publicPath: '../'}
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {publicPath: '../'}
                    },
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {publicPath: '../'}
                    },
                    {
                        loader: 'css-loader',
                        options: {importLoaders: 1}
                    }
                ]
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|otf|eot|ttf|svg)(\?[a-z\d=.]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: 'images/[name].[ext]'
                    }
                }]
            },
        ]
    },
    resolve: {
        modules: [path.resolve(WEB_DIR, 'node_modules')],
        extensions: ['.tsx', '.ts', '.js', '.mjs'],
        alias: {
            root: WEB_DIR,
            src: path.resolve(WEB_DIR, 'src')
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.resolve(DIST_FOLDER, 'election/**/*')
            ],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false
        }),
        new ConcatPlugin({
            name: 'crypto.bundle',
            fileName: '[name].js',
            filesToConcat: cryptoJsDependencies
        }),
        new MiniCssExtractPlugin({filename: "[name].style.css"}),
        new BundleAnalyzerPlugin({
            analyzerMode: DEV ? 'static' : 'disabled',
            openAnalyzer: false,
            reportFilename: 'election-report.html'
        }),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
    ],
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 1000
    },
};

module.exports = config;