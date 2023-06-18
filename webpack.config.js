const path =require('path')


module.exports ={
    mode: 'development',
    entry: {
        main:'./src/index.js',
        sub: './src/listing.js'
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true
}