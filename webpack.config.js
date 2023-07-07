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
    watch: true,
    devtool: "eval-source-map"
}