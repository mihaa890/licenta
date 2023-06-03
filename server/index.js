const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cors());

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, directConnection: true })
  .then(() => console.log('Connected!'));

app.use('/api', require('./api/routes/routes.js'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
