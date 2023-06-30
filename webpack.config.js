const path =require('path')


module.exports ={
    mode: 'development',
    entry: {
        proStart:'./src/proStart.js',
        showServices: './src/showServices.js',
        fetchList: './src/fetchList.js',
        edit: './src/edit.js',
        booking: './src/booking.js',
        bookingConfirm: './src/bookingConfirm.js',
        bookingrequest: './src/bookingrequest.js'
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true
}