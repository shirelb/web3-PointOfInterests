var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./assets/DButils');
var users = require('./server_modules/Users.js');
var countries = require('./server_modules/Countries.js');
var categories = require('./server_modules/Categories.js');
var pointsOfInterests = require('./server_modules/PointsOfInterests.js');
var reviews = require('./server_modules/Reviews.js');


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
// =============================================================================


app.use(function (req, res, next) {
    console.log("server got request");
    next();
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/', function (req, res) {
    // var token = req.headers['x-access-token'];
    // console.log(tokem);
    // res.send({message: 'hooray! welcome to our api!'});
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


app.use('/users', users);
app.use('/countries', countries);
app.use('/categories', categories);
app.use('/pointsOfInterests', pointsOfInterests);
app.use('/reviews', reviews);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var port = 8080;

app.listen(port, function () {

    console.log('Example app listening on port ' + port);

});

//-------------------------------------------------------------------------------------------------------------------


