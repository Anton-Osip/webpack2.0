const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all',
		},
	}
	if (isProd) {
		config.minimizer = [new CssMinimizerPlugin(), new TerserPlugin()]
	}
	return config
}

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`)

const cssLoaders = extra => {
	const loaders = [{ loader: MiniCssExtractPlugin.loader, options: {} }, 'css-loader']
	if (extra) {
		loaders.push(extra)
	}
	return loaders
}

const babelOptions = preset => {
	const opts = {
		presets: ['@babel/preset-env'],
	}
	if (preset) {
		opts.presets.push(preset)
	}
	return opts
}
const plugins = () => {
	const base = [
		new HtmlWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new CleanWebpackPlugin(),
		// new CopyWebpackPlugin([
		// 	// { from: path.resolve(__dirname, ''), to: '' }
		// ]),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),
	]

	if (isProd) {
		base.push(new BundleAnalyzerPlugin())
	}

	return base
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: { main: ['@babel/polyfill', './index.jsx'] },
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js', '.png'],
	},
	optimization: optimization(),
	devServer: {
		port: 3000,
		hot: isDev,
	},
	devtool: isDev && 'source-map',
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: babelOptions('@babel/preset-react'),
				},
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: babelOptions('@babel/preset-typescript'),
				},
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: babelOptions(),
				},
			},
			{
				test: /\.css$/,
				use: cssLoaders(),
			},
			{
				test: /\.s[ac]ss$/i,
				use: cssLoaders('sass-loader'),
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},
}
