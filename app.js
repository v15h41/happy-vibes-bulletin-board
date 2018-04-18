const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;



const router = require('./routes/routes.js');

// set the static files location
app.use(express.static('public'));

app.set('view engine', 'ejs');

// rountes
app.use('/', router);

app.listen(PORT, function(){
    console.log(`Express listening on post ${PORT}`);
});