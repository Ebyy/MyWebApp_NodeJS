const fs = require("fs");
var employees=[];
var departments =[];

initialize() = function(){
    employees = fs.readFile('./data/employees.json', 'utf8', (err,data = JSON.parse('employees.json'))=>{
        if(err){
            throw err;        
        }
        console.log(data);
    })


    departments = fs.readFile('./data/departments.json', 'utf8', (err,data = JSON.parse('departments.json'))=>{
        if(err){
            throw err;    
        }
        console.log(data);
    })
}


var getAllEmployees = function(){
    for(var i = 0; i < employees.length(); i++){
        
    }
}