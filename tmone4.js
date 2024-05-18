const express=require("express");
const mariadb=require("mariadb");
const bodyParser=require('body-parser');
application=express('body-parser');
const urlEncodedBodyParser=bodyParser.urlencoded({extended:false});
const timePass=(ms)=>{
var promise=new Promise((resolve)=>{
setTimeout(resolve,ms);
});
return promise;
}
class Company
{
constructor(name,studentsCount)
{
this.name=name;
this.studentsCount=studentsCount;
}
getName()
{
return this.name;
}
getStudentsCount()
{
return this.studentsCount;
}
}
class Student
{
constructor(id,name,placementType,company,salary)
{
this.id=id;
this.name=name;
this.placementType=placementType;
this.company=company;
this.salary=salary;
}
getId()
{
return this.id;
}
getName()
{
return this.name;
}
getPlacementType()
{
return this.placementType;
}
getSalary()
{
return this.salary;
}
}
application.post("/addPlacement",urlEncodedBodyParser,async function(request,response){
/*
console.log(request.body);
console.log(request.body.id);
console.log(request.body.name);
console.log(request.body.placementType);
console.log(request.body.company);
console.log(request.body.salary);
console.log(request.body.salaryType);
*/
var id=request.body.id;
var name=request.body.name;
var placementType=request.body.placementType;
var company=request.body.company;
var salary=request.body.salary;
var salaryType=request.body.salaryType;
mariadb.createConnection({
"user":"root",
"password":"tanish@01",
"host":"localhost",
"port":5506,
"database":"sakila"}).then(function(connection){
connection.query(` select * from student where id=${id}`).then(function(rows){
if(rows.length>0)
{
connection.end();
response.send({"success":false,"error":id+" exists"});
return;
}
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
connection.query(`insert into student values (${id},'${name}','${placementType}','${company}',${salary},'${salaryType}')`).then(function(rows){
connection.commit();
connection.end();
response.send({"success": true});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}) // application.post

application.get("/placements",async function(request,response){
mariadb.createConnection({
"user":"root",
"password":"tanish@01",
"host":"localhost",
"port":5506,
"database":"sakila"}).then(function(connection){
connection.query("select * from student order by salary desc,name,company").then(function(rows){
var students=[];
rows.forEach(function(row){
var id=row.id;
var name=row.name.trim();
var job_type=row.job_type;
var company=row.company.trim();
var salary=row.salary;
var salary_type=row.salary_type;
var placementType;
if(job_type=='I')
{
placementType="Internship";
}
if(job_type=="F")
{
placementType="Full time";
}
if(salary_type=='Y')
{
if(salary>99000)
{
salary=(salary/100000)+" lac per annum";
}
else
{
salary=salary+" per annum";
}
}
if(salary_type=='M')
{
if(salary>99000)
{
salary=(salary/100000)+" lac per month";
}
else
{
salary=salary+" per month";
}
}
students.push(new Student(id,name,placementType,company,salary));
})
response.send(students);
connection.end();
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
});


application.get("/companies",async function(request,response){
mariadb.createConnection({
"user":"root",
"password":"tanish@01",
"host":"localhost",
"port":5506,
"database":"sakila"}).then(function(connection){
connection.query("select company, count(*) as count from student group by company order by company").then(function(rows){
console.log(rows);
var companies=[];
rows.forEach(function(row){
var name=row.company.trim();
var studentsCount=row.count.toString();
console.log(name+" , "+studentsCount);
companies.push(new Company(name,studentsCount));
})
response.send(companies);
connection.end();
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
});



application.post("/updatePlacement",urlEncodedBodyParser,async function(request,response){
var id=request.body.id;
var name=request.body.name;
var placementType=request.body.placementType;
var company=request.body.company;
var salary=request.body.salary;
var salaryType=request.body.salaryType;
mariadb.createConnection({
"user":"root",
"password":"tanish@01",
"host":"localhost",
"port":5506,
"database":"sakila"}).then(function(connection){
connection.query(`select * from student where id=${id}`).then(function(rows){
if(rows.length==0)
{
connection.end();
response.send({"success":false,"error":id+" does not exists"});
return;
}
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
connection.query(`update student set name='${name}' ,job_type='${placementType}' , company='${company}',salary='${salary}',salary_type='${salaryType}' where id=${id}`).then(function(rows){
connection.commit();
connection.end();
response.send({"success": true});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}) 

application.post("/deletePlacement",urlEncodedBodyParser,async function(request,response){
var id=request.body.id;
mariadb.createConnection({
"user":"root",
"password":"tanish@01",
"host":"localhost",
"port":5506,
"database":"sakila"}).then(function(connection){
connection.query(`select * from student where id=${id}`).then(function(rows){
if(rows.length==0)
{
connection.end();
response.send({"success":false,"error":id+" does not exists"});
return;
}
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
connection.query(`delete from student  where id=${id}`).then(function(rows){
connection.commit();
connection.end();
response.send({"success": true});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}).catch(function(err){
response.send(err.message);
console.log(err.message);
});
}) 


application.listen(5050,function(err){
if(err)
{
console.log(err.message);
return;
}
console.log("Video Rental Library server is listening on port 5050");
});