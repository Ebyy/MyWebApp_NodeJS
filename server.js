/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eberechi Ogunedo      Student ID: 117277160     Date: 30-May-2019
*
*  Online (Heroku) Link: https://pacific-spire-28303.herokuapp.com/
*
********************************************************************************/ 

var data = require("./data-service.js");
var express = require("express");
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// function call that connects css folder public
app.use(express.static('public')); 

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

// route for employees
app.get("/employees", function(req,res){
    data.getAllEmployees()
    .then(function(data){
        res.json(data);
    }        
    )
    .catch(function(err){
        res.json({message: err});
    })
});

// route for departments
app.get("/departments", function(req,res){
    data.getDepartments()
    .then(function(data){
        res.json(data);
    }        
    )
    .catch(function(err){
        res.json({message: err});
    })
});

// route for managers
app.get("/managers", function(req,res){
    data.getManagers()
    .then(function(data){
        res.json(data);
    }        
    )
    .catch(function(err){
        res.json({message: err});
    })
});


// setup http server to listen on HTTP_PORT , loads up all the data as well
data.initialize().then (app.listen(HTTP_PORT, onHttpStart))
.catch(function(err){
    res.json({message: err});
});