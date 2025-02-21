const mongoose = require("mongoose");


const costMaterialSchema = new mongoose.Schema({
    model: String,
    lcd: String,
    batt: String,
    scocca: String,
    lcdBatt: String,
    scBattLcd: String,
    cam: String,
    fId: String,
    scocLcd: String,
    scocBatt: String,
    washing:String
});

module.exports = mongoose.model('CostMaterial', costMaterialSchema);