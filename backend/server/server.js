const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = require('./config/dbconn.js')
const PORT = process.env.PORT || 5000

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors);

app.get('/', (req, res) => {
    console.log(req);
    return res.status(234).send('Welcome aaa');
});

app.use('/users', require('./routes/userRoutes.js'));
app.use('/tasks', require('./routes/taskRoutes.js'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

