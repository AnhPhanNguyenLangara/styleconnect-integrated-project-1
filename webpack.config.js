const path =require('path')
module.exports ={
    mode: 'development',
    entry: {
        main:'./src/main.js',
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devtool: "eval-source-map",
    watch: true
}