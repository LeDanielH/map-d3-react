const prod = process.argv.indexOf('-p') !== -1;

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
	filename: "[name].css",
	disable: !prod
});

import * as webpack from 'webpack';//to access built-in plugins
import * as path from 'path';

const config = {
	entry: ['./src/js/index.js', './src/index.pug'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: prod ? "source-map" : "eval-source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(scss|sass)$/,
				use: extractSass.extract({
						use: [{
							loader: 'css-loader',
							options: {
								sourceMap: !prod,
								minimize: prod
							}
						},
							{
								loader: 'postcss-loader',
								options: {
									sourceMap: !prod,
								}
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: !prod
								}
							}, {

								loader: 'sass-resources-loader',
								options: {
									resources: [ // direct import faster than sass import

										// settings
										path.resolve(__dirname, './node_modules/bourbon/app/assets/stylesheets/_bourbon.scss'),
										path.resolve(__dirname, './src/sass/project/settings/_variables.scss'),
										path.resolve(__dirname, './src/sass/project/settings/_placeholders.scss'),
										path.resolve(__dirname, './src/sass/project/settings/_mixins.scss'),

										// base styles
										path.resolve(__dirname, './node_modules/normalize-scss/sass/_normalize.scss'),
										path.resolve(__dirname, './src/sass/project/initial/_normalize-init.scss'),
										path.resolve(__dirname, './src/sass/project/initial/_resets.scss'),
										path.resolve(__dirname, './src/sass/project/initial/_typo.scss')
									]
								}
							}],
						fallback: 'style-loader',
					}
				),

				exclude: /node_modules/
			},
			{
				test: /\.pug$/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'pug-loader',
						options: {
							pretty: true
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'index.html',
			template: './src/index.pug',
			// inlineSource: prod ? '.(js|css)$' : '',
			alwaysWriteToDisk: true
		}),
		new HtmlWebpackHarddiskPlugin(),
		extractSass
	],
	devServer: {
		open: true,
		overlay: true,
		port: 9876,
		clientLogLevel: "warning",
		historyApiFallback: true,
		inline: true,
		hot: true
	}
};

config.plugins = config.plugins || [];
if (prod) {
	config.plugins.push(new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': `"production"`
		}
	}));
	// config.plugins.push(new HtmlWebpackInlineSourcePlugin());

} else {
	config.plugins.push(new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': `""`
		}
	}));
	config.plugins.push(new webpack.HotModuleReplacementPlugin({}))
}

module.exports = config;