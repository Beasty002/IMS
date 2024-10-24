const {Schema , model} = require("mongoose")

const saleRecordSchema = new Schema({

    saleIds:{
        type:Array,
        required: true
    },
    dos:{ // date of sale
        type: Date,
        default: () => new Date().toISOString().split('T')[0]
    }
});

// Pre-save middleware to ensure date format
saleRecordSchema.pre('save', function(next) {
    if (this.dos && this.dos instanceof Date) {  
        this.dos = this.dos.toISOString().split('T')[0];  
    }
    next();
});

const SaleRecordModel = new model("SaleRecord", saleRecordSchema);

module.exports = SaleRecordModel