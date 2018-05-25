var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var DButilsAzure = require('../DButils');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

var point_id = 1;

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
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

//add point of view
router.post('/addPoint', function (req, res) {
    console.log("in route /pointsOfInterests/addPoint");

    DButilsAzure.execQuery("" +
        "INSERT INTO PointsOfInterest (pointId, name,category,rating ,views,description,picture)" +
        " VALUES (" + point_id + ",'" + req.body.name + "','" + req.body.category + "'," +
        req.body.rating + "," + req.body.views + ",'" + req.body.description + "','" +
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

//addviewToPoint
router.put('/addView', function (req, res) {
    console.log("in route /pointsOfInterests/addView");

    DButilsAzure.execQuery("" +
        "UPDATE PointsOfInterest " +
        "SET views = views + 1" +
        " WHERE pointId = " + point_id )
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

//get3RandomAndPopularPoints
router.get('/3Populars/', function (req, res) {
    console.log("in route /pointsOfInterests/3Populars/");


    DButilsAzure.execQuery("SELECT TOP 3 * FROM PointsOfInterest ")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

module.exports = router;