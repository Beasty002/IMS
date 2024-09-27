const {Schema , model} = require("mongoose")

const saleSchema = new Schema({

    //
    sCategory:{
        type: String,
        required: true
    },
    
    sBrand:{
        type: String,
        required: true
    },
    sRowLabel:{
        type: String,
        required: true
    },
    sColLabel:{
        type: String,
        
    },
    sQty:{
        type: Number,
        required: true
    },

})

const SaleModel = new model("Sale", saleSchema);

module.exports = SaleModel