require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error');
const { seedAdmin } = require('./controllers/authController');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

connectDB().then(seedAdmin).then(() =>
  app.listen(process.env.PORT || 5000, () => console.log('API on http://localhost:' + (process.env.PORT || 5001)))
).catch(e => { console.error('Startup failed:', e.message); process.exit(1); });
