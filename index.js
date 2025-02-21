const express = require('express');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const salesManagementModel = require('./models/salesManagementModel');
const cors = require('cors');
const app = express();
const DeviceType = require('./models/deviceModel');
const cron = require('node-cron');
const sendEmailWithAttachment = require('./utils/sendEmail');

require('dotenv').config();

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Set up GridFS (if you're using it)
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

// Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/products', require('./routes/productRoutes')); // Product routes
app.use('/api/customers', require('./routes/customerRoutes')); // Customer routes
app.use('/api/sales', require('./routes/salesManagementRoutes')); // Sales routes
app.use('/api/devices', require('./routes/deviceRoutes')); // Sales routes
app.use('/api/invoices', require('./routes/invoiceRoutes')); // Sales routes
app.use('/api/technical', require('./routes/technicalRoute')); // Sales routes
app.use('/api/cost-material', require('./routes/costMaterialRoutes')); // Sales routes
app.use('/api/cost-technical', require('./routes/costTechnicalRoutes')); // Sales routes
app.use('/api/payments', require('./routes/paymentRoutes')); // Sales routes
app.use('/api/models', async (req, res) => {
  try {
    const devices = await DeviceType.find({});
    let models = [];

    devices.forEach((deviceType) => {
      deviceType.brands.forEach((brand) => {
        models.push(...brand.models);
      });
    });

    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}); // Sales routes

// cron.schedule("0 0 1 * *", async () => {
//   console.log("Generating Monthly Sales Report...");
//   await generateMonthlySalesReport();
// });

cron.schedule('0 0 1 * *', async () => {
  (async () => {
    console.log('first');
    try {
      // Aaj ki date lein aur uske hisaab se month ke sales lein
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const sales = await salesManagementModel.find({
        time: {
          $gte: startOfMonth.toISOString(),
          $lte: endOfMonth.toISOString(),
        },
      });

      console.log('seco');
      if (sales.length === 0) {
        console.log('No sales found for this month.');
        return;
      }

      // Excel Workbook aur Worksheet banayein
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Monthly Sales Report');

      // Columns define karein
      worksheet.columns = [
        { header: 'Customer Name', key: 'customerName', width: 20 },
        { header: 'Customer ID', key: 'customerId', width: 15 },
        { header: 'Shipment Number', key: 'shipmentNumber', width: 20 },
        { header: 'Total Price', key: 'totalPrice', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Time', key: 'time', width: 25 },
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

      console.log('ddddd');

      // File path
      const fileName = `sales_report_${today.getFullYear()}_${
        today.getMonth() + 1
      }.xlsx`;
      const filePath = `./reports/${fileName}`;

      // Folder check karein agar exist nahi karta toh banayein
      const fs = require('fs');
      if (!fs.existsSync('./reports')) {
        fs.mkdirSync('./reports');
      }

      // Excel file save karein
      await workbook.xlsx.writeFile(filePath);
      console.log(`Sales report saved: ${filePath}`);

      // File ko email karein
      await sendEmailWithAttachment(filePath, fileName);
    } catch (error) {
      console.error('Error generating sales report:', error);
    }
  })();
  console.log('Generating Monthly Sales Report...');
});

const PORT = process.env.PORT || 5005;

app.get('/', (req, res) => {
  res.send('Welcome to the Backend API. The server is running!');
});

app.listen(PORT, () => console.log(`Server started on  port ${PORT}`));
