var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var DButilsAzure = require('../assets/DButils');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    console.log("in route /categories/");
    DButilsAzure.execQuery("SELECT category FROM Categories")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


router.delete('/delete', function (req, res) {
    console.log("in route /categories/delete");
    DButilsAzure.execQuery("DELETE FROM Categories")
        .then(function (result) {
            res.status(200).send("All categories deleted");
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.delete('/delete/:category', function (req, res) {
    console.log("in route /categories/delete/:category");

    let category_to_delete = req.params.category;

    DButilsAzure.execQuery("DELETE FROM Categories WHERE category='"+category_to_delete+"'")
        .then(function (result) {
            res.status(200).send(category_to_delete+" deleted");
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


router.post('/init', function (req, res) {
    console.log("in route /categories/init");

    var xmlfile = __dirname + "/../categories.xml";

    fs.readFile(xmlfile, "utf-8", function (error, text) {
        if (error) {
            throw error;
        } else {
            parser.parseString(text, function (err, result) {
                let i = 0;
                while (i < result['Categories']['Category'].length) {
                    DButilsAzure.execQuery("" +
                        "INSERT INTO Categories (category)" +
                        " VALUES ('" + result['Categories']['Category'][i]['Name'] + "')")
                        .then(function (result) {
                            console.log(result['Categories']['Category'][i]['Name'] + "added successfully!");
                            
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                    i++;
                }
            });
            res.status(200).send("All Categories added");
        }
    });
});

module.exports = router;