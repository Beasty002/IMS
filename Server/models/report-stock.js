const {Schema , model} = require("mongoose")

const reportStockSchema = new Schema({

    totalStock:{
        type: Number,
        required: true
    },
    brandId:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    rowLabel:{
        type:String,
        required:true
    },
    colLabel:{
        type:String,
        required:true
    },
    stockUntilThisDate:{ // date of report
        type: Date,
    }

})

const ReportStockModel = new model("ReportStock", reportStockSchema);

module.exports = ReportStockModel