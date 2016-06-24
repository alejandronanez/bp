
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

exports.devServer = function(options) {
	return {
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			stats: 'errors-only',
			host: options.host,
			port: options.port
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin({
				multistep: true
			})
		]
	}
};

exports.setupCSS = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.css$/,
					loaders: ['style', 'css'],
					include: paths
				}
			]
		}
	}
};

exports.minify = function() {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	}
}

exports.setFreeVariable = function(key, value) {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [
			new webpack.DefinePlugin(env)
		]
	}
}

exports.extractBundle = function(options) {
	const entry = {};
	entry[options.name] = options.entries;

	return {
		entry: entry,
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				names: [options.name, 'manifest']
			})
		]
	}
}

exports.clean = function(path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path], {
				root: process.cwd()
			})
		]
	};
}

exports.extractCSS = function(paths) {
	return {
		module: {
			loaders: [
				// Extract css during build
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract('style', 'css'), // .extract('style', 'css!postcss!..!...!')
					include: paths
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('[name].[chunkhash].css')
		]
	}
}

exports.purifyCSS = function(paths) {
	return {
		plugins: [
			new PurifyCSSPlugin({
				basePath: process.cwd(),
				paths: paths
			})
		]
	}
}
