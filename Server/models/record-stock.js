const {Schema , model} = require("mongoose")

const recordStockSchema = new Schema({

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

})

const RecordStockModel = new model("RecordStock", recordStockSchema);

module.exports = RecordStockModel