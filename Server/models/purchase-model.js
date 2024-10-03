const {Schema , model} = require("mongoose")

const purchaseSchema = new Schema({

    purchaseIds:{
        type:Array,
        required: true
    },
    dop:{ // date of sale
        type: Date,
        default: Date.now
    }
})

const PurchaseModel = new model("Purchase", purchaseSchema);

module.exports = PurchaseModel