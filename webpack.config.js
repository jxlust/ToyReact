module.exports = {
    entry: {
        // main: './main.js'
        main: './src/game.jsx'
    },
    module: {
        rules: [{
            test: /\.js|.jsx$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        ['@babel/plugin-transform-react-jsx', {
                            pragma: 'createElement'
                        }]
                    ]
                }
            }
        }]
    },
    mode: 'development',
    optimization: {
        minimize: false
    }
}