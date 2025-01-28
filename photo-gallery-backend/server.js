const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/images', require('./routes/image'));
app.use('/albums', require('./routes/album'));

app.listen(5000, () => console.log('Server running on port 5000'));