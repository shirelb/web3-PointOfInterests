var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');
var users = require('./server_modules/Users.js');
var countries = require('./server_modules/Countries.js');
var categories = require('./server_modules/Categories.js');
var pointsOfInterests = require('./server_modules/PointsOfInterests.js');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// var port = process.env.PORT || 8080;        // set our port


// let users = {};


// ROUTES FOR OUR API

// =============================================================================


/*app.use(function (req, res, next) {



    console.log("server got request");

    next();



});*/


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

app.get('/', function (req, res) {

    // var token= req.headers['x-access-token']

    // console.log(tokem);

    res.send({message: 'hooray! welcome to our api!'});

});

/*// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

app.get('/Users', function (req, res) {

    res.send(users)

});*/


/*



//add user to system

//on postman use x-www-form-urlencoded

app.post('/addUser', function (req, res) {

    console.log("adding a new user")



    let id = Object.keys(users).length + 1;



    //each user has: name, birthYear, password

    //save each user in the users dictionary



    let user = {}

    user.name = req.body.name;

    user.byear = req.body.byear;

    user.password = req.body.password;



    users[id] = user;



    console.log("user successfully added!")

    res.sendStatus(200);



});



//get user detail

app.get('/Users/:id', function (req, res, next) {

    console.log("get user")



    console.log(req.params)

    if (users[req.params.id])

        res.json(users[req.params.id]);

    else

    // res.send("No such user exists")

        next('err')

});



//delete user

app.delete('/:id', function (req, res) {

    console.log("delete user")



    if (users[req.params.id]) {

        delete (users[req.body.id])

        res.send("User deleted successfully")

    }

    else

        res.send("No such user exists")





});

////////////////////////////////////////////////////////////////////////////





// use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());



// use morgan to log requests to the console

app.use(morgan('dev'));



var superSecret = "SUMsumOpen"; // secret variable





// =======================

// routes ================

// =======================

// basic route

app.get('/', function (req, res) {

    res.send('Hello! The API is at http://localhost:' + port + '/api');

});





// route middleware to verify a token

app.use('/reg', function (req, res, next) {



    // check header or url parameters or post parameters for token

    var token = req.body.token || req.query.token || req.headers['x-access-token'];



    // decode token

    if (token) {



        // verifies secret and checks exp

        jwt.verify(token, superSecret, function (err, decoded) {

            if (err) {

                return res.json({success: false, message: 'Failed to authenticate token.'});

            } else {

                // if everything is good, save to request for use in other routes

                // get the decoded payload and header

                var decoded = jwt.decode(token, {complete: true});

                req.decoded = decoded;

                console.log(decoded.header);

                console.log(decoded.payload)

                next();

            }

        });



    } else {



        // if there is no token

        // return an error

        return res.status(403).send({

            success: false,

            message: 'No token provided.'

        });

    }



});

*/


// app.use('/reg/poi', poi);

app.use('/users', users);
app.use('/countries', countries);
app.use('/categories', categories);
app.use('/pointsOfInterests', pointsOfInterests);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var port = 3000;

app.listen(port, function () {

    console.log('Example app listening on port ' + port);

});

//-------------------------------------------------------------------------------------------------------------------


