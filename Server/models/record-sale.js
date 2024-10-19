const {Schema , model} = require("mongoose")

const recordSaleSchema = new Schema({
    
    soldQty:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    brandId:{
        type:String,
        required:true
    },
    rowLabel:{
        type: String,
        required: true
    },
    colLabel:{
        type: String,
        required: true
    },

})

const RecordSaleModel = new model("RecordSale", recordSaleSchema);

module.exports = RecordSaleModel