var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
module.exports = {
    devServer: {
        historyApiFallback: true,
        port: 8080
    },
    entry: './index.js',
    output: {
        public: '/',
        filename: 'bundle.js',
        path: './dist'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'index.html',
            inject: true,
            template: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}