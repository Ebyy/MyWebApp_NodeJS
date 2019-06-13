//import { stat } from "fs";

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
                reject("No data found");
                return;              
            }
            
            if(data.length != 0){
                employees = JSON.parse(data);
                fs.readFile('./data/departments.json', 'utf8', (err,data)=>{
                    if(err){  
                        throw err; 
                        reject("No data found");
                        return;            
                    }
                    
                    if(data.length !== 0){
                        departments = JSON.parse(data);
                        resolve();
                        return;
                    } 
                })
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

module.exports.addEmployee = function(empData){
    return new Promise(function(resolve,reject){
        if(empData.isManager !== true){
            empData.isManager = false;
        } 
        empData.emloyeeNum = employees.length + 1;
        employees.push(empData);
        resolve();
        
    })   
}

//call that returns employees by status
module.exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve,reject){
        if(employees.length > 0){
            var byStatus = [];
            for(let i = 0; i < employees.length; i++){
                if(employees[i].status == status){
                    byStatus.push(employees[i]);
                }
            }
            if(byStatus.length == 0){
                reject("no by status data");
                return;
            }else{
                resolve(byStatus);
                console.log("resolved by status");
            }
        }
        else{
            reject("no employees data");
        }
    })    
}

// call that filters employees by their department
module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function(resolve,reject){
        if(employees.length > 0){
            var byDept = [];
            for(let i=0; i < employees.length; i++){
                if(employees[i].department == department){
                    byDept.push(employees[i]);
                    //console.log("pushed to by dept");
                }
            }
            if(byDept.length == 0){
                reject("no by dept data");
                return;
            }else{
                resolve(byDept);
                //console.log("resolved by dept");
            }
        }
        else{
            reject("no employees data");
        }

    })
}

// filters employees by that have the same manager
module.exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve,reject){
        if(employees.length > 0){
            let byManager = [];
            byManager = employees.filter(employees=>employees.employeeManagerNum == manager);
            if(byManager.length == 0){
                reject("no by manager data available");
                return;
            }
            resolve(byManager);
        }else{
            reject("no employees data available");
        }
    })
}
//filters a particular employee with the employee number parsed
module.exports.getEmployeeByNum = function(num){   
    return new Promise(function(resolve,reject){
        if(employees.length > 0){
            let empObj = [];
            empObj = employees.filter(employees=>employees.employeeNum == num);
            if(empObj.length == 0){
                reject("no emp data retrieved");
            }
            resolve(empObj);
        }
        else{
            reject("no employees data available");
        }

    })
}