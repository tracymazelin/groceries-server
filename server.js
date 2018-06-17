// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect('mongodb://localhost/groceries');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Models
var Grocery = mongoose.model('Grocery', {
    name: String,
    quantity: Number
});

// Routes

// Get groceries
app.get('/api/groceries', function (req, res) {

    console.log("fetching groceries");

    // use mongoose to get all groceries in the database
    Grocery.find(function (err, groceries) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err);

        res.json(groceries); // return all groceries in JSON format
    });
});

// create review and send back all groceries after creation
app.post('/api/groceries', function (req, res) {

    console.log("creating review");

    // create a review, information comes from request from Ionic
    Grocery.create({
        name: req.body.name,
        quantity: req.body.quantity,
        done: false
    }, function (err, grocery) {
        if (err)
            res.send(err);

        // get and return all the groceries after you create another
        Grocery.find(function (err, groceries) {
            if (err)
                res.send(err);
            res.json(groceries);
        });
    });

});

// delete a review
app.delete('/api/groceries/:grocery_id', function (req, res) {
    Grocery.remove({
        _id: req.params.grocery_id
    }, function (err, grocery) {
        console.error("Error deleting grocery ", err);
    });
});


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");