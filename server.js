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
var multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// function call that connects css folder public
app.use(express.static('public')); 

//set middleware for urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// defining storage variable with multer
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {

      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // tell multer to use the diskStorage function for naming files instead of the default.
  const upload = multer({ storage: storage });

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

    if(req.query.status){
        data.getEmployeesByStatus(req.query.status)
        .then(function(data){
            res.json(data);
        }).catch(function(err){
            res.json({message: err});
        })
    }

    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department)
        .then(function(data){
            res.json(data);
        }).catch(function(err){
            res.json({message: err});
        })
    }

    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager)
        .then(function(data){
            res.json(data);
        }).catch(function(err){
            res.json({message: err});
        })
    }
    else{
        data.getAllEmployees()
        .then(function(data){
            res.json(data);
        }        
        )
        .catch(function(err){
            res.json({message: err});
        })
    }

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

// route that sends the file "/views/addEmployee.html "
app.get("/employees/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

// route that sends the file "/views/addImage.html "
app.get("/images/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

// route that sends file "/views/addImage.html " with the POST method
app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});

//route to get uploaded image data 
app.get("/images", function(req,res){
    fs.readdir('./public/images/uploaded', (err,data)=>{
        res.json({image:data});
    });
});

// route that sends file "/views/addEmployee " with the POST method
app.post("/employees/add", (req,res) => {
    data.addEmployee(req.body)
    .then(function(){
        res.redirect("/employees");
    }        
    )
});


//route for "employee/value"
app.get("/employee/:value", function(req,res){
    console.log("hey");
    data.getEmployeeByNum(req.params.value)
    .then(function(data){
        res.json(data);
    })
})

// setup http server to listen on HTTP_PORT , loads up all the data as well
data.initialize().then (app.listen(HTTP_PORT, onHttpStart))
.catch(function(err){
    res.json({message: err});
});