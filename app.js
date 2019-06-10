const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const createUser = require('./blockchain');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));




app.listen(3000, function(){
    console.log('Connected to port 3000');
});

app.use('/', createUser);
