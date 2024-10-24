const {Schema , model} = require("mongoose")

const purchaseSchema = new Schema({

    purchaseIds:{
        type:Array,
        required: true
    },
    dop:{ // date of sale
        type: Date,
        default: () => new Date().toISOString().split('T')[0]
    }
});

// Pre-save middleware to ensure date format
purchaseSchema.pre('save', function(next) {
    if (this.dop && this.dop instanceof Date) {
        this.dop = this.dop.toISOString().split('T')[0];
    }
    next();
});

const PurchaseModel = new model("Purchase", purchaseSchema);

module.exports = PurchaseModel