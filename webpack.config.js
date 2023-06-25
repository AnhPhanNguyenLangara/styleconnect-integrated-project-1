const path =require('path')


module.exports ={
    mode: 'development',
    entry: {
        main:'./src/index.js',
        listing: './src/listing.js',
        fetchList: './src/fetchList.js',
        edit: './src/edit.js'
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true
}