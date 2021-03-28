const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const FlowWebpackPlugin = require('flow-webpack-plugin')

module.exports = {
    entry: {
        server: './src/bin/www',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    target: 'node',
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: true,   // if you don't put this is, __dirname
        __filename: true,  // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    module: {
        rules: [
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
        ]
    },

    /*plugins: [
        new FlowWebpackPlugin(/!*{
            failOnError: false,
            failOnErrorWatch: false,
            reportingSeverity: 'error',
            printFlowOutput: true,
            flowPath: require.main.require('flow-bin'),
            flowArgs: ['--color=always'],
            verbose: false,
        }*!/)
    ]*/
}