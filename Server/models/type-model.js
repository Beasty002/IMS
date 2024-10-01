const {Schema , model} = require("mongoose")

const typeSchema = new Schema({

    type:{
        type: String,
        required: true
    },
    brandId:{
        type:String,
        required:true,
    }

})

const TypeModel = new model("Type", typeSchema);

module.exports = TypeModel