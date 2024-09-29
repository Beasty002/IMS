const {Schema , model} = require("mongoose")
const saleSchema = require("./sales-model")

const saleRecordSchema = new Schema({

    saleIds:{
        type:Array,
        required: true
    },
    dos:{ // date of sale
        type: Date,
        default: Date.now
    }
})

const SaleRecordModel = new model("SaleRecord", saleRecordSchema);

module.exports = SaleRecordModel