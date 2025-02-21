const ExcelJS = require("exceljs");
const salesManagementModel = require("../models/salesManagementModel");
const { sendEmailWithAttachment } = require("./sendEmail");



module.exports = async function generateMonthlySalesReport() {
  console.log("first")
  try {
    // Aaj ki date lein aur uske hisaab se month ke sales lein
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const sales = await salesManagementModel.find({
      time: { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() },
    });
    
    console.log("seco")
      if (sales.length === 0) {
        console.log("No sales found for this month.");
        return;
      }
  
      // Excel Workbook aur Worksheet banayein
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Monthly Sales Report");
  
      // Columns define karein
      worksheet.columns = [
        { header: "Customer Name", key: "customerName", width: 20 },
        { header: "Customer ID", key: "customerId", width: 15 },
        { header: "Shipment Number", key: "shipmentNumber", width: 20 },
        { header: "Total Price", key: "totalPrice", width: 10 },
        { header: "Status", key: "status", width: 15 },
        { header: "Time", key: "time", width: 25 },
      ];
  
      // Sales data ko worksheet me add karein
      sales.forEach((sale) => {
        worksheet.addRow({
          customerName: sale.customerName,
          customerId: sale.customerId,
          shipmentNumber: sale.shipmentNumber,
          totalPrice: sale.totalPrice,
          status: sale.status,
          time: sale.time,
        });
      });

      console.log("ddddd")
  
      // File path
      const fileName = `sales_report_${today.getFullYear()}_${today.getMonth() + 1}.xlsx`;
      const filePath = `./reports/${fileName}`;
  
      // Folder check karein agar exist nahi karta toh banayein
      const fs = require("fs");
      if (!fs.existsSync("./reports")) {
        fs.mkdirSync("./reports");
      }
  
      // Excel file save karein
      await workbook.xlsx.writeFile(filePath);
      console.log(`Sales report saved: ${filePath}`);
  
      // File ko email karein
      await sendEmailWithAttachment(filePath, fileName);
    } catch (error) {
      console.error("Error generating sales report:", error);
    }
  }