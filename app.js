const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;



const router = require('./routes/routes.js');

app.set('view engine', 'ejs');

app.use('/', router);

app.listen(PORT, function(){
    console.log(`Express listening on post ${PORT}`);
});