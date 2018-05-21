var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var DButilsAzure = require('../DButils');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    console.log("in route /countries/");
    DButilsAzure.execQuery("SELECT * FROM Countries")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


router.delete('/delete', function (req, res) {
    console.log("in route /countries/delete");
    DButilsAzure.execQuery("DELETE FROM Countries")
        .then(function (result) {
            res.status(200).send("All Countries deleted");
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.delete('/delete/:country', function (req, res) {
    console.log("in route /countries/delete/:country");

    let country_to_delete = req.params.country;

    DButilsAzure.execQuery("DELETE FROM Countries WHERE country='"+country_to_delete+"'")
        .then(function (result) {
            res.status(200).send(country_to_delete+" deleted");
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.get('/init', function (req, res) {
    console.log("in route /countries/init");

    var xmlfile = __dirname + "/../countries.xml";

    fs.readFile(xmlfile, "utf-8", function (error, text) {
        if (error) {
            throw error;
        } else {
            parser.parseString(text, function (err, result) {
                let i = 0;
                while (i < result['Countries']['Country'].length) {
                    DButilsAzure.execQuery("" +
                        "INSERT INTO Countries (country)" +
                        " VALUES ('" + result['Countries']['Country'][i]['Name'] + "')")
                        .then(function (result) {
                            console.log(result['Countries']['Country'][i]['Name'] + "added successfully!");
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                    i++;
                }
            });
            res.status(200).send("All Countries added");
        }
    });
});

module.exports = router;