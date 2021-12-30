const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
	template: './src/index.html',
	filename: './index.html',
});
module.exports = {
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: [/node_modules/, /.*\.d\.ts/],
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.d\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.sass$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
						},
					},
					'postcss-loader',
					'sass-loader',
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.styles', '.sass', '.css'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	devServer: {
		open: true,
		hot: true,
	},
	entry: './src/index.tsx',
	mode: 'development',
	plugins: [htmlPlugin],
};
