const {Schema , model} = require("mongoose")

const categorySchema = new Schema({

    //
    title:{
        type: String,
        required: true
    }
})

const CategoryModel = new model("Category", categorySchema);

module.exports = CategoryModel