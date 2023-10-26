const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

const config = {
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, './src/index.tsx')
    ],
    output: {
        path: path.resolve(__dirname, '../web/web/js'),
        filename      : 'bundle.min.js',
        chunkFilename : '[name].min.js',
        publicPath    : '/js/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ["babel-loader"]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    optimization : {
        minimizer   : [new UglifyJsPlugin()],
        splitChunks : {
            cacheGroups : {
                commons : {
                    test   : /[\\/]node_modules[\\/]/,
                    name   : 'vendors',
                    chunks : 'all'
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'BASE_PATH': JSON.stringify('/'),
                'API_URL': JSON.stringify('/v1'),
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
    ],
}

module.exports = config
