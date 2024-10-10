const {Schema , model} = require("mongoose")

const columnSchema = new Schema({

    column:{
        type: String,
        required: true
    },
    brandId:{
        type:String,
        required:true,
    },
    typeId:{
        type: String,
    }

})

const ColumnModel = new model("Column", columnSchema);

module.exports = ColumnModel