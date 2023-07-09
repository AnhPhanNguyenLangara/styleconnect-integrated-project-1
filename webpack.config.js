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
        prosDashboard: './src/prosDashboard.js',
        customerDashboard: './src/customerDashboard.js',
        customerRegister: './src/customerRegister.js'
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true,
    devtool: "eval-source-map"
}