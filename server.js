/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eberechi Ogunedo      Student ID: 117277160     Date: 23-June-2019
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
const exphbs = require('express-handlebars');

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
const storage = multer.diskStorage({destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    } 
});
  
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

//include setting to let sever know how to handle handlebars .hbs extension files
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options){
            if(arguments.length < 3){
                throw new Error("Handlebars Helper equal needs 2 parameters");
            }
            if(lvalue != rvalue){
                return options.inverse(this);
            } else{
                return options.fn(this);
            }
        } 
    }
}));    

// specify view for the .hbs extension files
app.set('view engine', '.hbs');

//include middleware to fix nav bar to show active page
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


//ROUTES
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.render('home');
    //res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.render('about');
});

// route for employees and conditional filters
app.get("/employees", function(req,res){

    if(req.query.status){
        data.getEmployeesByStatus(req.query.status)
        .then(function(data){
            res.render("employees", {employees:data});
        }).catch(function(err){
            res.render({message: err});
        })
    }

    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department)
        .then(function(data){
            res.render("employees", {employees:data});
        }).catch(function(err){
            res.render({message: err});
        })
    }

    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager)
        .then(function(data){
            res.render("employees", {employees:data});
        }).catch(function(err){
            res.render({message: err});
        })
    }
    else{
        data.getAllEmployees()
        .then(function(data){
            res.render("employees", {employees:data});
        }        
        )
        .catch(function(err){
            res.render({message: err});
        })
    }

});

// route for departments
app.get("/departments", function(req,res){
    data.getDepartments()
    .then(function(data){
        res.render("departments", {departments:data});
    }        
    )
    .catch(function(err){
        res.render({message: err});
    })
});

// route that sends the file "/views/addEmployee.html "
app.get("/employees/add", function(req,res){
    res.render('addEmployee');
});

// route that sends the file "/views/addImage.html "
app.get("/images/add", function(req,res){
    res.render('addImage');
});

// route that sends file "/views/addImage.html " with the POST method
app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});

//route to get uploaded image data 
app.get("/images", function(req,res){
    fs.readdir('./public/images/uploaded', (err,data)=>{
        res.render("images", {images:data});
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
app.get("/employees/:value", function(req,res){
    data.getEmployeeByNum(req.params.value)
    .then(function(data){
        //res.json(data);
        res.render("employee", {employee:data});
    })
    .catch(function(err){
        res.render("employee", {message: err});
    })
});

//route to update employee with changes made and redirect to employees page to see updated version
app.post("/employee/update", (req, res) => {
    console.log(req.body);
    data.updateEmployee(req.body)
    .then(function(){
        res.redirect("/employees");
    })   
});

// 404 page
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname,"views/error.html"));
  })

// setup http server to listen on HTTP_PORT , loads up all the data as well
data.initialize().then (app.listen(HTTP_PORT, onHttpStart))
.catch(function(err){
    res.json({message: err});
});