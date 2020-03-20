const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const visits = require('./routes/api/visits');

app.use('/api/visits',visits);

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => console.log(`Server started on port ${port}`));