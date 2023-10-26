const path = require('path');
const webpack = require('webpack')

const config = {
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, './src/index.tsx')
    ],
    output: {
        path: path.resolve(__dirname, '../web/web/js'),
        filename: 'bundle.js'
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
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'BASE_PATH': JSON.stringify('/'),
                'ADMIN_PATH': JSON.stringify('/admin'),
                'API_URL': JSON.stringify('/v1')
            }
        }),
    ]
}

module.exports = config
