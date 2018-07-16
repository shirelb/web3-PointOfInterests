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


router.post('/add', function (req, res) {
    console.log("in route /users/add");

    DButilsAzure.execQuery("" +
        "INSERT INTO Users (firstName,lastName,city ,country,username,password,email)" +
        " VALUES ('" + req.body.firstName + "','" + req.body.lastName + "','" +
        req.body.city + "','" + req.body.country + "','" + req.body.username + "','" +
        req.body.password + "','" + req.body.email + "')")
        .then(function (result) {
            console.log(" 1 result: " + result);
            return DButilsAzure.execQuery("SELECT userId FROM Users WHERE username = '" + req.body.username + "'");
        })
        .then(function (user) {
            console.log("2 result: " + user[0]['userId']);
            save_QA_restore_password(req, user[0]['userId'])
                .then(function (result) {
                    console.log("save_QA_restore_password success 2     ");
                    console.log("3 result: " + user[0]['userId']);
                    save_categories(req, user[0]['userId'])
                        .then(function (result) {
                            console.log("save_categories success 2");
                            res.status(200).send("user added successfully! =)");
                        })
                        .catch(function (err) {
                            console.log(err);
                            res.status(500).send(err, "save_categories failed!");
                        })
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(500).send(err, "save_QA_restore_password failed!");
                })
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err, "user add failed!");
        })
});

function save_QA_restore_password(req, user_id) {
    let i = 0;
    // let isError = false;
    let arr = [];
    while (i < req.body.questions.length) {
        arr.push(DButilsAzure.execQuery("" +
            "INSERT INTO QaRestorePassword (userId,question,answer)" +
            " VALUES (" + user_id + ",'" + req.body.questions[i] + "','" + req.body.answers[i] + "')"));
        i++;
    }
    return Promise.all(arr)
        .then(function (result) {
            console.log(result, "QA restore_password success");
        })
        .catch(function (err) {
            // isError = true;
            console.log(err, "QA restore_password failed");
        });
    // if (!isError) {
    //     resolve("QA restore_password success 1");
    // }
    // else {
    //     reject("QA restore_password success 1");
    // }
};

// )
// ;
// }

function save_categories(req, user_id) {
    // return new Promise(function (resolve, reject) {

    let i = 0;
    // let isError = false;
    let arr = [];
    while (i < req.body.categories.length) {
        arr.push(DButilsAzure.execQuery("" +
            "INSERT INTO UserCategories (userId,category)" +
            " VALUES (" + user_id + ",'" + req.body.categories[i] + "')"))
        i++;
    }
    return Promise.all(arr)
        .then(function (result) {
            console.log(result, "save_categories success");
        })
        .catch(function (err) {
            // isError = true;
            console.log(err, "save_categories failed");
        });
    // if (!isError) {
    //     resolve("save_categories success 1");
    // }
    // else {
    //     reject("save_categories success 1");
    // }
};

// )
// ;
// }

router.get('/qaRestorePassword/:id', function (req, res) {
    console.log("in route /users/qaRestorePassword/:id");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT userId, question FROM QaRestorePassword WHERE userId = '" + id + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.post('/qaRestorePassword/check', function (req, res) {
    console.log("in route /users/qaRestorePassword/check");

    let id = req.body.id;
    let question = req.body.question;
    let answer = req.body.answer;
    console.log("id: " + id);
    console.log("question: " + question);
    console.log("answer: " + answer);

    DButilsAzure.execQuery("" +
        "SELECT * FROM QaRestorePassword " +
        "WHERE userId = '" + id + "' AND question='" + question + "' AND answer='" + answer + "' ")
        .then(function (result) {
            console.log("result: " + result);
            if (result.length === 0) {
                res.status(204).send("not the answer to the question!"); // code 204-no content
            }
            else {
                DButilsAzure.execQuery("" +
                    "SELECT username,password FROM Users WHERE userId = '" + id + "'")
                    .then(function (result) {
                        res.status(200).send(result);
                    });
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

// route to authenticate a user (POST http://localhost:3000/users/login/authenticate)
router.post('/login/authenticate', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send({message: "bad values"});
    } else {
        DButilsAzure.execQuery("" +
            "SELECT * FROM Users " +
            "WHERE username = '" + req.body.username + "' AND password='" + req.body.password + "'")
            .then(function (user) {
                if (user.length === 0) {
                    res.json({
                        "success": 'false',
                        "message": 'Username or password is incorrect ',
                        "token": 'null'
                    });

                }
                // res.status(200).send(result);
                else {
                    sendToken(user, res);
                }

            })
            .catch(function (err) {
                res.status(500).send("Authentication failed. Wrong username or password ");
            });
        // for (id in Users) {
        //     var user = Users[id];
        //
        //     if (req.body.userName === user.userName) {
        //         if (req.body.password === user.password) {
        //             sendToken(user, res);
        //         } else {
        //             res.send({success: false, message: 'Authentication failed. Wrong Password'});
        //             return
        //         }
        //     }
        // }
        // res.send({success: false, message: 'Authentication failed. No such user name'})
    }
});

function sendToken(user, res) {
    var payload = {
        username: user.username,
        admin: user.isAdmin
    };

    var token = jwt.sign(payload, superSecret, {
        expiresIn: "1d" // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        'success': 'true',
        'message': 'Enjoy your token!',
        'token': token
    });
}

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    console.log("in route /users/");
    DButilsAzure.execQuery("SELECT * FROM Users")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.get('/username/:username', function (req, res) {
    console.log("in route /users/username/:username");

    let username = req.params.username;
    console.log("username: " + username);
    // res.send("the requested resource");

    DButilsAzure.execQuery("SELECT * FROM Users WHERE username = '" + username + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.get('/id/:id', function (req, res) {
    console.log("in route /users/id/:id");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM Users WHERE userId = " + id + " ")
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

router.post('/validToken', function (req, res) {
    console.log("in route /users/validToken");
    res.status(200).send({success:"valid token!",payload:req.decoded});
});

router.get('/categories/:id', function (req, res) {
    console.log("in route /users/categories");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM UserCategories WHERE userId = " + id + " ")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


router.get('/favoritesPoints/userId/:id', function (req, res) {
    console.log("in route /users/favoritesPoints");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM FavoritePoints WHERE userId = " + id + " ")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.post('/favoritesPoints/add/', function (req, res) {
    console.log("in route /users/favoritesPoints/add");

    DButilsAzure.execQuery("" +
        "INSERT INTO FavoritePoints (userId,pointId,orderNum,savedDate)" +
        " VALUES (" + req.body.userId + "," + req.body.pointId + ", " + req.body.orderNum + ",'" + req.body.savedDate + "' )")
        .then(function (result) {
            res.status(200).send("favorites point added successfully! =)");
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
});

router.delete('/favoritesPoints/remove/userId/:userId/pointId/:pointId', function (req, res) {
    console.log("in route /users/favoritesPoints/remove/userId/:id/pointId/:id");

    let userId = req.params.userId;
    let pointId_to_delete = req.params.pointId;
    console.log("userId: " + userId);
    console.log("pointId_to_delete: " + pointId_to_delete);

    DButilsAzure.execQuery("DELETE FROM FavoritePoints WHERE userId= " + userId + " AND pointId= " + pointId_to_delete + "")
        .then(function (result) {
            res.status(200).send("favorite point deleted");
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
});

router.put('/favoritesPoints/update/', function (req, res) {
    console.log("in route /users/favoritesPoints/update");

    DButilsAzure.execQuery("" +
        "UPDATE FavoritePoints " +
        "SET orderNum= " + req.body.orderNum + " " +
        "WHERE userId=" + req.body.userId + " AND pointId=" + req.body.pointId)
        .then(function (result) {
            res.status(200).send("favorites point updated successfully! =)");
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
});

router.get('/favoritesPoints/2Latest/userId/:id', function (req, res) {
    console.log("in route /users/favoritesPoints");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("" +
        "SELECT TOP 2 * FROM FavoritePoints " +
        "WHERE userId = " + id + " " +
        "ORDER BY savedDate DESC ")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});


module.exports = router;