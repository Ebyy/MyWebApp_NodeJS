const fs = require("fs");
var employees=[];
var departments =[];
var managers = [];
//function call that loads data
module.exports.initialize = function(){
    return new Promise(function(resolve,reject){
        fs.readFile('./data/employees.json', 'utf8', (err,data)=>{
            if(err){
                throw err;               
            }
            
             if(data.length != 0){
                 employees = JSON.parse(data);
                 resolve();
                 return;
             } 
             else{
                reject("No Employee data found");
                return;
            }
        })
    
    
       fs.readFile('./data/departments.json', 'utf8', (err,data)=>{
        if(err){  
            throw err;               
        }
        
         if(data.length !== 0){
             departments = JSON.parse(data);
             resolve();
             return;
         } 
         else{
            reject("No Department data found");
            return;
        }
        })
    })

}
// call that returns employees
module.exports.getAllEmployees = function(){
    return new Promise(function(resolve,reject){
        if(employees.length === 0){
            reject("No Employee data found");
        }
        else{
            resolve(employees);
            console.log("employee data received");
        }
    })  
}
//call that returns departments
module.exports.getDepartments = function(){
    return new Promise(function(resolve,reject){
        if(departments.length === 0){
            reject("no departments data");
        }
        else{
            resolve(departments);
            console.log("department data received");
        }
    })    
}
//call that returns managers
module.exports.getManagers = function(){
    return new Promise(function(resolve,reject){
        for(var i = 0; i < employees.length; i++){
            if(employees[i].isManager === true){
                managers.push(employees[i]);               
                
            }          
        }
        if(managers.length === 0){
            reject("No manager data");
        }
        else{
            resolve(managers);
            console.log("manager data received");
        }
        
    })    
}