import React from 'react'

const getCompanies=async ()=>{
var promise=new Promise((resolve,reject)=>{
fetch("/companies").then((response)=>{
if(!response.ok) throw Error("OOPS, can't fetch data, try after some time");
return response.json();
}).then((companies)=>{
resolve(companies);
}).catch((error)=>{
reject(error);
});
});
return promise;
}

const getPlacements=async ()=>{
var promise=new Promise((resolve,reject)=>{
fetch("/placements").then((response)=>{
if(!response.ok) throw Error("OOPS, can't fetch data, try after some time");
return response.json();
}).then((students)=>{
resolve(students);
}).catch((error)=>{
reject(error.message);
});
});
return promise;
}


const AppExample10=()=>{
const [students,setStudents]=React.useState([]);
const [companies,setCompanies]=React.useState([]);
const [filter,setFilter]=React.useState({jobType: [],salaryType: [],companies: []});
React.useEffect( ()=>{
getCompanies().then((companies)=>{
setCompanies(companies);
getPlacements().then((s)=>{
setStudents(s);
},(error)=>{
alert(error);
});
},(error)=>{
alert(error);
});
},[]);

const applyFilter=(f)=>{
//alert(JSON.stringify(f));
setFilter(f);
}



return(
<div>
<HeaderComponent year='2021' />
<div style={{display: 'flex'}}>
<div style={{marginLeft: "20px",paddingRight: "10px",borderRight: "1px solid #d14c13",fontSize: "15pt"}}>
<div style={{width: "100%",backgroundColor: "#d14c13",padding: "2px",textAlign: "center",color: "#FFFFFF",fontWeight: "bold"}}>F I L T E R S</div>
 { companies.length > 0 ? (
                        <FilterComponent companies={companies} onChange={applyFilter} />
                    ) : (
                        <div></div>
                    )}</div>

<div style={{flexGrow: 1,marginLeft: "20px"}}>
<PlacementsComponent filterBy={filter} students={students} />
</div>
</div>

</div>
)
}

const FilterComponent=({companies,onChange})=>{
const [jobTypeState,setJobTypeState]=React.useState([]);
const [salaryTypeState,setSalaryTypeState]=React.useState([]);
const [companiesState,setCompaniesState]=React.useState([]);
React.useEffect( ()=>{
var j=[];
j.push({"type": "F","state":false});
j.push({"type": "I","state":false});
setJobTypeState(j);
var s=[];
s.push({"type": "Y","state":false});
s.push({"type": "M","state":false});
setSalaryTypeState(s);
var aa=[];
companies.forEach((company)=>{
aa.push({"name":company.name,"state":false});
});
setCompaniesState(aa);
},[]);

const jobTypeChanged=(jt)=>{
var filter={};
filter.salaryType=salaryTypeState;
filter.companies=companiesState;
var j=[];
j.push({"type": "F","state": jt.fullTime});
j.push({"type": "I","state": jt.internship});
filter.jobType=j;
setJobTypeState(j);
onChange(filter);
}

const salaryTypeChanged=(st)=>{
var filter={};
filter.jobType=jobTypeState;
filter.companies=companiesState;
var s=[];
s.push({"type": "Y","state": st.yearly});
s.push({"type": "M","state": st.monthly});
filter.salaryType=s;
setSalaryTypeState(s);
onChange(filter);
}

const companiesTypeChanged = async (st) => {
var filter={};
filter.jobType=jobTypeState;
filter.salaryType=salaryTypeState;
await companiesState.forEach((company)=>{
if(company.name==st.name)
{
company.state=st.state;
}
});
filter.companies=companiesState;
setSalaryTypeState(companiesState);
onChange(filter);
}

return(
<div>
<JobTypeComponent onChange={jobTypeChanged}/>
<hr />
<SalaryTypeComponent onChange={salaryTypeChanged}/>
<hr />
 <CompaniesComponent companies={companies} onChange={companiesTypeChanged}  />
</div>
)
}

const HeaderComponent=({year})=>{
return(
<h1 style={{marginLeft: "20px"}}>ABCD Technologies - Placement Records ({year})</h1>
)
}

const JobTypeComponent=({onChange})=>{
const [fullTimeChecked,setFullTimeChecked]=React.useState(false);
const [internshipChecked,setInternshipChecked]=React.useState(false);

const stateChanged=(ev)=>{
var jobTypesState={
fullTime: fullTimeChecked,
internship: internshipChecked
};
if(ev.currentTarget.value=='F')
{
setFullTimeChecked(ev.currentTarget.checked);
jobTypesState.fullTime=ev.currentTarget.checked;
}
if(ev.currentTarget.value=='I')
{
setInternshipChecked(ev.currentTarget.checked);
jobTypesState.internship=ev.currentTarget.checked;
}
onChange(jobTypesState);
}

return(
<fieldset>
<legend>Job Type</legend>
<input type='checkbox' onChange={stateChanged} value='F' style={{width: "20px",height: "20px"}} />Full time<br />
<input type='checkbox' onChange={stateChanged} value='I' style={{width: "20px",height: "20px"}} />Internship<br />
</fieldset>
)
}

const SalaryTypeComponent=({onChange})=>{
const [yearlyChecked,setYearlyChecked]=React.useState(false);
const [monthlyChecked,setMonthlyChecked]=React.useState(false);

const stateChanged=(ev)=>{
var salaryTypesState={
yearly: yearlyChecked,
monthly: monthlyChecked
};
if(ev.currentTarget.value=='Y')
{
setYearlyChecked(ev.currentTarget.checked);
salaryTypesState.yearly=ev.currentTarget.checked;
}
if(ev.currentTarget.value=='M')
{
setMonthlyChecked(ev.currentTarget.checked);
salaryTypesState.monthly=ev.currentTarget.checked;
}
onChange(salaryTypesState);
}

return(
<fieldset>
<legend>Salary Type</legend>
<input type='checkbox' onChange={stateChanged} value='M' style={{width: "20px",height: "20px"}} />Monthly<br />
<input type='checkbox' onChange={stateChanged} value='Y' style={{width: "20px",height: "20px"}} />Yearly<br />
</fieldset>
)
}





const CompaniesComponent = ({ companies, onChange, companiesState }) => {
const stateChanged = (ev) => {
onChange({"name":ev.currentTarget.value,"state":ev.currentTarget.checked});
} 	

return(
<fieldset>
<legend>Companies</legend>
{
companies.map((company)=>{
return(
<span key={company.name}>
<input type='checkbox' onChange={stateChanged} value={company.name} style={{width: "20px",height: "20px"}} />{company.name} ({company.studentsCount})<br />
</span>
)
})
}
</fieldset>
)
}




const PlacementsComponent=({filterBy,students,onEdit,onDelete})=>{
var filteredStudents=[];
students.forEach((student)=>{
if(student.placementType)
{
var considerFullTime=false;
var considerInternship=false;
if(filterBy.jobType.length==2 )
{
considerFullTime=filterBy.jobType[0].state;
considerInternship=filterBy.jobType[1].state;
}
if(student.placementType.substring(0,1).toUpperCase()=="F")
{
if(considerFullTime==false) return;
}
if(student.placementType.substring(0,1).toUpperCase()=="I")
{
if(considerInternship==false) return;
}
}
filteredStudents.push(student);
});
if(filteredStudents.length==0)
{
filteredStudents=students;
}
var considerYearly=false;
var considerMonthly=false;
if(filterBy.salaryType.length==2 )
{
considerYearly=filterBy.salaryType[0].state;
considerMonthly=filterBy.salaryType[1].state;
}
if(considerYearly!=false || considerMonthly!=false)
{
var arr=[];
filteredStudents.forEach((student)=>{
if(student.salary)
{
if(student.salary.includes("annum"))
{
if(considerYearly==false) return;
}
if(student.salary.includes("month"))
{
if(considerMonthly==false) return;
}
}
arr.push(student);
});
filteredStudents=arr;
}
var considerCompany=false;
var arr=[];
filterBy.companies.forEach((company)=>{
if(company.state!=false) 
{
considerCompany=true;
arr.push(company);
}
});
var aaa=[];
if(considerCompany!=false)
{
//console.log(arr[0].name);
filteredStudents.forEach((student)=>{
for(var i=0;i<arr.length;i++)
{
if(arr[i].name==student.company)
{
console.log("Here for comparision with "+student.company);
if(arr[i].state==false) 
{
console.log("Returning : "+student.name+" , company : "+student.company);
return;
}
else
{
console.log("Pushing : "+student.name+" , company : "+student.company);
aaa.push(student);
}
}
}
});
filteredStudents=aaa;
}


return(
<div>
<h1>Placements</h1>
<table style={{border: "1px solid black",borderCollapse: "collapse"}}>
<thead>
<tr>
<th style={{border: "1px solid black",borderCollapse: "collapse"}}>S.No.</th>
<th style={{border: "1px solid black",borderCollapse: "collapse"}}>Name</th>
<th style={{border: "1px solid black",borderCollapse: "collapse"}}>Company</th>
<th style={{border: "1px solid black",borderCollapse: "collapse"}}>Package</th>
<th style={{border: "1px solid black",borderCollapse: "collapse"}}>Type</th>
</tr>
</thead>
<tbody>
{
filteredStudents.map((student,index)=>{
return(
<tr key={student.id} >
<td style={{border: "1px solid black",borderCollapse: "collapse"}}>{index+1}</td>
<td style={{border: "1px solid black",borderCollapse: "collapse"}}>{student.name}</td>
<td style={{border: "1px solid black",borderCollapse: "collapse"}}>{student.company}</td>
<td style={{border: "1px solid black",borderCollapse: "collapse"}}>{student.salary}</td>
<td style={{border: "1px solid black",borderCollapse: "collapse"}}>{student.placementType}</td>
</tr>
)
})
}
</tbody>
</table>
</div>
)
}


export default AppExample10;