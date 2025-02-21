const mongoose = require("mongoose");

const costTechnicalSchema = new mongoose.Schema({
  model: String,
  lcd: String,
  batt: String,
  scocca: String,
  lcdBatt: String,
  scBattLcd:String,
  cam: String,
  fId: String,
  scocLcd: String,
  scocBatt: String,
  washing: String,
  ASSIST: String
});

module.exports = mongoose.model("CostTechnical", costTechnicalSchema);
