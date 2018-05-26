var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var DButilsAzure = require('../DButils');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


//get all points of interests
router.get('/', function (req, res) {
    console.log("in route /pointsOfInterests/");
    DButilsAzure.execQuery("SELECT * FROM PointsOfInterest")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


//getPointByCategory
router.get('/category/:category', function (req, res) {
    console.log("in route /pointsOfInterests/category/:category");

    let category = req.params.category;
    console.log("category: " + category);

    DButilsAzure.execQuery("SELECT * FROM PointsOfInterest WHERE category = '" + category + "'")
        .then(function (result) {
            if (result.length === 0) {
                res.status(204).send("no such category!"); // code 204-no content
            } 
            else{  
                res.status(200).send(result);
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


//addviewToPoint
router.put('/addView', function (req, res) {
    console.log("in route /pointsOfInterests/addView");

    DButilsAzure.execQuery("" +
        "UPDATE PointsOfInterest " +
        "SET views = views + 1" +
        " WHERE pointId = " + point_id)
        .then(function (result) {
            res.status(200).send("user added successfully! =)");
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
});

//getPointOfInterestByID
router.get('/id/:id', function (req, res) {
    console.log("in route /pointsOfInterests/id/:id");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM PointsOfInterest WHERE pointId = '" + id + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

//getPointOfInterestByName
router.get('/name/:name', function (req, res) {
    console.log("in route /pointsOfInterests/name/:name");

    let name = req.params.name;
    console.log("id: " + name);

    DButilsAzure.execQuery("SELECT * FROM PointsOfInterest WHERE name = '" + name + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

//getRandomAndPopularPoints
router.get('/Populars/', function (req, res) {
    console.log("in route /pointsOfInterests/3Populars/");

    DButilsAzure.execQuery("SELECT * FROM PointsOfInterest WHERE rating>=80")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


// route middleware to verify a category
    router.use('/addPoint', function (req, res, next) {
        console.log("in route middleware to verify a category");
    
        var category = req.body.category ;
        console.log("category: " + category);
    
        if (category) {
            DButilsAzure.execQuery("" +
            "SELECT * FROM Categories WHERE category='"+req.body.category +"'")
            .then(function (result) {
                if (result.length === 0) {
                    res.status(204).send("no such category"); // code 204-no content
                }else{
                    next();
                }
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).send(err);
            })
           
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No category provided.'
            });
        }
    });

//add point of interest
router.post('/addPoint', function (req, res) {
    console.log("in route /pointsOfInterests/addPoint");

    DButilsAzure.execQuery("" +
    "INSERT INTO PointsOfInterest (pointId, name,category,rating ,views,description,picture)" +
    " VALUES (" + point_id + ",'" + req.body.name + "','" + req.body.category + "'," +
    req.body.rating + ", 0 ,'" + req.body.description + "','" +
    req.body.picture + "')")
    .then(function (result) {
        point_id++;
        res.status(200).send("point added successfully! =)");
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).send(err);
    })
});


module.exports = router;