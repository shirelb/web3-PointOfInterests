var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var DButilsAzure = require('../DButils');


// const superSecret = "SUMsumOpen"; // secret variable
//

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

var user_id = 1;
/*router.post('/', function (req, res) {

    Users[id] =
        {

            "userName": req.body.userName,
            "password": req.body.password,
            "isAdmin": req.body.isAdmin
        };

    id++;

    res.sendStatus(200)

});

router.post('/authenticate', function (req, res) {

    if (!req.body.userName || !req.body.password)
        res.send({message: "bad values"})

    else {

        for (id in Users) {
            var user = Users[id];

            if (req.body.userName === user.userName)
                if (req.body.password === user.password)
                    sendToken(user, res);
                else {
                    res.send({success: false, message: 'Authentication failed. Wrong Password'});
                    return
                }

        }

        res.send({success: false, message: 'Authentication failed. No such user name'})
    }

});

function sendToken(user, res) {
    var payload = {
        userName: user.userName,
        admin: user.isAdmin
    };

    var token = jwt.sign(payload, superSecret, {
        expiresIn: "1d" // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
    });

}*/

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
    console.log("in route /users/:id");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM Users WHERE userId = '" + id + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.get('/qaRestorePassword/:id', function (req, res) {
    console.log("in route /users/qaRestorePassword");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM QaRestorePassword WHERE userId = '" + id + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.get('/categories/:id', function (req, res) {
    console.log("in route /users/categories");

    let id = req.params.id;
    console.log("id: " + id);

    DButilsAzure.execQuery("SELECT * FROM UserCategories WHERE userId = '" + id + "'")
        .then(function (result) {
            res.status(200).send(result);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

router.post('/add', function (req, res) {
    console.log("in route /users/add");

    DButilsAzure.execQuery("" +
        "INSERT INTO Users (userId,firstName,lastName,city ,country,username,password,email)" +
        " VALUES (" + user_id + ",'" + req.body.firstName + "','" + req.body.lastName + "','" +
        req.body.city + "','" + req.body.country + "','" + req.body.username + "','" +
        req.body.password + "','" + req.body.email + "')")
        .then(function (result) {
            save_QA_restore_password(req, user_id);
            console.log("save_QA_restore_password success");
        })
        .then(function (result) {
            save_categories(req, user_id);
            console.log("save_categories success");
        })
        .then(function (result) {
            user_id++;
            res.status(200).send("user added successfully! =)");
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        })
});

function save_QA_restore_password(req, user_id) {
    let i = 0;
    while (i < req.body.questions.length) {
        DButilsAzure.execQuery("" +
            "INSERT INTO QaRestorePassword (userId,question,answer)" +
            " VALUES (" + user_id + ",'" + req.body.questions[i] + "','" + req.body.answers[i] + "')")
            .then(function (result) {
                console.log(result);
            })
            .catch(function (err) {
                console.log(err);
            });

        i++;
    }
}

function save_categories(req, user_id) {
    let i = 0;
    while (i < req.body.categories.length) {
        DButilsAzure.execQuery("" +
            "INSERT INTO UserCategories (userId,category)" +
            " VALUES (" + user_id + ",'" + req.body.categories[i]  + "')")
            .then(function (result) {
                console.log(result);
            })
            .catch(function (err) {
                console.log(err);
            });

        i++;
    }
}

router.post('/login', function (req, res) {


});




module.exports = router;