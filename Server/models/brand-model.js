const {Schema , model} = require("mongoose")

const brandSchema = new Schema({
    //
    name:{
        type: String,
        required: true
    },
    
    multiVar:{
        type:Boolean,
        default:0 // 0 = category has multiple variations
    },
    rowLabel:{
        type:String,
        required:true
    },
    colLabel:{
        type:String,
        required:true
    }

})

const BrandModel = new model("Brand", brandSchema);

module.exports = BrandModel