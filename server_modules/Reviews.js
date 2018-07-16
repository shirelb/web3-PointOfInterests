var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var DButilsAzure = require('../DButils');


// use morgan to log requests to the console
router.use(morgan('dev'));
const superSecret = "LondonHereICome"; // secret variable


router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


router.get('/2Latest/pointId/:id', function (req, res) {
    console.log("in route /reviews/2Latest/pointId/:id");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("" +
        "SELECT TOP 2 userId, pointId, reviewMsg, reviewDate from Reviews\n" +
        "WHERE (pointId='" + id + "') AND reviewDate = (SELECT MAX(reviewDate) from Reviews)")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


// route middleware to verify a token
// router.use('/reg', function (req, res, next) {
router.use(function (req, res, next) {
    console.log("in route middleware to verify a token");

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log("token: " + token);

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
                console.log(decoded.payload);
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

router.get('/userId/:id', function (req, res) {
    console.log("in route /reviews/userId/:id");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM Reviews WHERE userId = '" + id + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


router.get('/pointId/:id', function (req, res) {
    console.log("in route /reviews/pointId/:id");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM Reviews WHERE pointId = '" + id + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


router.post('/add/rate', function (req, res) {
    console.log("in route /reviews/add/rate");

    DButilsAzure.execQuery("" +
        "SELECT * FROM Reviews " +
        " WHERE userId = '" + req.body.userId + "' AND pointId= '" + req.body.pointId + "'")
        .then(function (review) {
            if (review.length === 0) {
                DButilsAzure.execQuery("" +
                    "INSERT INTO Reviews (userId,pointId,rate)" +
                    " VALUES (" + req.body.userId + ",'" + req.body.pointId + "'," + req.body.rate + ")")
                    .then(function (result) {
                        update_point_rating(req.body.pointId)
                            .then(function (result) {
                                res.status(200).send("rate added successfully! =)");
                            })
                            .catch(function (err) {
                                console.log(err);
                                res.status(500).send(err);
                            })
                    })
                    .catch(function (err) {
                        console.log(err);
                        res.status(500).send(err);
                    })
            }
            else {
                DButilsAzure.execQuery("" +
                    "UPDATE Reviews " +
                    "SET rate = '" + req.body.rate + "' " +
                    "WHERE userId = '" + req.body.userId + "' AND pointId = '" + req.body.pointId + "'")
                    .then(function (result) {
                        update_point_rating(req.body.pointId)
                            .then(function (result) {
                                res.status(200).send("rate added successfully! =)");
                            })
                            .catch(function (err) {
                                console.log(err);
                                res.status(500).send(err);
                            })
                    })
                    .catch(function (err) {
                        console.log(err);
                        res.status(500).send(err);
                    })
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        });
});

function update_point_rating(pointId) {
    console.log("update_point_rating");
    return DButilsAzure.execQuery(
        "SELECT AVG(rate) as rate_avg " +
        "FROM Reviews " +
        "WHERE pointId = " + pointId + "")
        .then(function (result) {
            console.log("AVG(rate): " + result[0]["rate_avg"]);
            return DButilsAzure.execQuery("" +
                "UPDATE PointsOfInterest " +
                "SET rating = '" + ((result[0]["rate_avg"] / 5) * 100) + "' " +
                "WHERE pointId = '" + pointId + "'")
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
}


router.put('/update/rate', function (req, res) {
    console.log("in route /reviews/update/rate");

    DButilsAzure.execQuery("" +
        "SELECT * FROM Reviews " +
        " WHERE userId = '" + req.body.userId + "' AND pointId= '" + req.body.pointId + "'")
        .then(function (review) {
            DButilsAzure.execQuery("" +
                "UPDATE Reviews " +
                "SET rate = '" + req.body.rate + "' " +
                "WHERE userId = '" + req.body.userId + "' AND pointId = '" + req.body.pointId + "'")
                .then(function (result) {
                    update_point_rating(req.body.pointId)
                        .then(function (result) {
                            res.status(200).send("rate updated successfully! =)");
                        })
                        .catch(function (err) {
                            console.log(err);
                            res.status(500).send(err);
                        })
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        });
});


router.post('/add/reviewMsg', function (req, res) {
    console.log("in route /reviews/add/reviewMsg");

    DButilsAzure.execQuery("" +
        "SELECT * FROM Reviews " +
        " WHERE userId = '" + req.body.userId + "' AND pointId= '" + req.body.pointId + "'")
        .then(function (review) {
            if (review.length === 0) {
                DButilsAzure.execQuery("" +
                    "INSERT INTO Reviews (userId,pointId,reviewMsg,reviewDate)" +
                    " VALUES (" + req.body.userId + "," + req.body.pointId + ",'" + req.body.reviewMsg + "','" + req.body.reviewDate + "')")
                    .then(function (result) {
                        res.status(200).send("review added successfully! =)");
                    })
                    .catch(function (err) {
                        console.log(err);
                        res.status(500).send(err);
                    })
            }
            else {
                DButilsAzure.execQuery("" +
                    "UPDATE Reviews " +
                    "SET reviewMsg = '" + req.body.reviewMsg + "' , reviewDate = '" + req.body.reviewDate + "' " +
                    "WHERE userId = '" + req.body.userId + "' AND pointId = '" + req.body.pointId + "'")
                    .then(function (result) {
                        res.status(200).send("review added successfully! =)");
                    })
                    .catch(function (err) {
                        console.log(err);
                        res.status(500).send(err);
                    })
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        });
});

router.put('/update/reviewMsg', function (req, res) {
    console.log("in route /reviews/update/reviewMsg");
    console.log("req.body.reviewDate "+ req.body.reviewDate);

    DButilsAzure.execQuery("" +
        "SELECT * FROM Reviews " +
        " WHERE userId = '" + req.body.userId + "' AND pointId= '" + req.body.pointId + "'")
        .then(function (review) {
            DButilsAzure.execQuery("" +
                "UPDATE Reviews " +
                "SET reviewMsg = '" + req.body.reviewMsg + "' , reviewDate = '" + req.body.reviewDate + "' " +
                "WHERE userId = '" + req.body.userId + "' AND pointId = '" + req.body.pointId + "'")
                .then(function (result) {
                    console.log(result);
                    res.status(200).send("review updated successfully! =)");
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        });
});




module.exports = router;