const {Schema , model} = require("mongoose")

const brandSchema = new Schema({
    //
    brandName:{
        type: String,
        required: true
    },
    
    multiVar:{
        type:Boolean,
        default:0 // 0 = category has multiple variations
    },
    rowLabel:{
        type:String,
    },
    colLabel:{
        type:String,
    }

})

const BrandModel = new model("Brand", brandSchema);

module.exports = BrandModel