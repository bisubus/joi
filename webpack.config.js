/*eslint-env node, es6 */
/*eslint comma-dangle: 0 */

'use strict';

let path = require('path');
let webpack = require('webpack');

module.exports = {
	cache: true,
	target: 'web',
	entry: {
		'joi-browser': './lib/index.js',
		'joi-browser.min': './lib/index.js'
	},
	output: {
		filename: '[name].js',
		path: 'dist',
		library: 'joi',
		libraryTarget: 'umd',
		pathinfo: true
	},
	resolve: {
		alias: {
			net: path.resolve(__dirname, './lib/browser-net.js'),
			util: path.resolve(__dirname, './lib/browser-util.js'),
			dns: path.resolve(__dirname, './lib/browser-stub.js'),
			crypto: path.resolve(__dirname, './lib/browser-stub.js'),
			moment: path.resolve(__dirname, './lib/browser-moment.js')
		},
	},
	devtool: 'source-map',
	node: {
		global: true, // Buffer lib
		process: false,
		Buffer: true,
		setImmediate: false
	},
	module: {
		loaders: [		
			{
				loader: 'babel',
				test: /\.js$/,
				exclude: /node_modules[\\\/]buffer/
			}
		],
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			comments : / ^/,
			compress: {
				warnings: false,
				screw_ie8 : false,
				drop_console: true
			}
		})
	],
};