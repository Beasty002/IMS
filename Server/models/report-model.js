const {Schema , model} = require("mongoose")
const mongoose = require("mongoose")

const reportSchema = new Schema({
    allColumns: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        column: String,
        brandId: mongoose.Schema.Types.ObjectId,
        v: Number
      }
    ],
    brandCol: String,
    brandRow: String,
    matrix: {
      type: Map,
      of: Map, // Each key in `matrix` can be a map for flexibility
    },
    today: String, // Or Date type if you want to store it as a Date object
    brandId: mongoose.Schema.Types.ObjectId
  });
  
const ReportModel = mongoose.model("Report", reportSchema);

module.exports = ReportModel
  