const {Schema , model} = require("mongoose")

const stockSchema = new Schema({

    stock:{
        type: Number,
        required: true
    },
    parentCat:{
        type:String,
        required:true,
    },
    parentBrand:{
        type:String,
        required:true,
    },

    rowLabel:{
        type: String,
        required: true,
    },
    colLabel:{
        type: String,
        required: true,
    }
})

const StockModel = new model("Stock", stockSchema);

module.exports = StockModel