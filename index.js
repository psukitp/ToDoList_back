const express = require('express')
const cors = require('cors')
const router = require('./router/index')
const bodyParser = require('body-parser');


const PORT = 53000;
const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
    type: ['application/json', 'text/plain']
}));


app.use('/api', router);


app.listen(PORT, () => console.log('server started on port ' + PORT))