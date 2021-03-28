const path = require("path")
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const FlowWebpackPlugin = require('flow-webpack-plugin')

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    target: 'web',
    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },

            {
                test: /\.pug$/,
                use: ['html-loader', 'pug-html-loader'],
                exclude: /node_modules/
            },

            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        //options: { minimize: true }
                    }
                ]
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