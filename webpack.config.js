
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./tooling/parts');

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build'),
	style: path.join(__dirname, 'app', 'main.scss')
};

const common = {
	entry: {
		app: ['babel-polyfill', PATHS.app],
		style: ['babel-polyfill', PATHS.style]
	},
	output: {
		path: PATHS.build,
		filename: '[name].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'SPAs Boilerplate'
		})
	]
};
/* eslint-disable no-var */
var config;
/* eslint-enable no-var */

/* eslint-disable indent */
switch (process.env.npm_lifecycle_event) {
	case 'build':
		config = merge(
			common,
			parts.lintJS(PATHS.app),
			{
				devtool: 'source-map',
				output: {
					path: PATHS.build,
					filename: '[name].[chunkhash].js',
					chunkFilename: '[chunkhash].js'
				}
			},
			parts.clean(PATHS.build),
			parts.setFreeVariable(
				'process.env.NODE_ENV',
				'production'
			),
			parts.extractBundle({
				name: 'vendor',
				entries: ['react']
			}),
			parts.setupBabel(PATHS.app),
			parts.minify(),
			parts.extractCSS(PATHS.style),
			parts.purifyCSS([PATHS.app]),
			parts.setupSCSS(PATHS.style)
		);
		break;
	default:
		config = merge(
			parts.lintJS(PATHS.app),
			common,
			{
				devtool: 'eval-source-map'
			},
			parts.setupCSS(PATHS.style),
			parts.setupSCSS(PATHS.style),
			parts.resolve(),
			parts.setupBabel(PATHS.app),
			parts.setupPOSTCSS(),
			parts.devServer({
				host: process.env.HOST,
				port: process.env.PORT
			})
		);
}
/* eslint-enable indent */

module.exports = validate(config);
