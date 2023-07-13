const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Model/Usermodel");
const { empModel } = require("../Model/employee.model");
require("dotenv").config();
const dashRoutes = Router();

dashRoutes.post("/employees",async(req,res)=>{
    try {
       const {firstName,lastName,email,department,salary} = req.body
        const employee = new empModel({firstName,lastName,email,department,salary});
        await employee.save();
        res.status(200).send({"msg":"Employee added succcessfully"})
    } catch (error) {
       res.status(400).send({"msg":error.message})
    }
   })
   
   dashRoutes.get("/employees",async(req,res)=>{
       try {
          
           const emp = await empModel.find();
           
           res.status(200).send({"msg":"all employee",emp})
       } catch (error) {
          res.status(400).send({"msg":error.message})
       }
      })
   
   dashRoutes.get("/filter",async(req,res)=>{
   try {
       const Department = req.query.department;
       const emp = await empModel.find({department:Department});
       res.status(200).send({"msg":"data filtered successfully",emp})
   } catch (error) {
       res.status(400).send({"msg":error.message})
   }
   })
   
   dashRoutes.get("/sort",async(req,res)=>{
       try {
           const Salary = req.query.salary
           let sort ={}
           if(Salary==="asc"){
               sort = {salary:1}
           }else{
               sort={salary:-1}
           }
           const emp = await empModel.find().sort(sort);

           res.status(200).send({"msg":"sort data",emp})
       } catch (error) {
           res.status(400).send({"msg":error.message})
       }
   })
   
   dashRoutes.get("/search",async(req,res)=>{
       try {
           const {firstName} = req.query
           const emp = await empModel.find({
               firstName:{ $regex: new RegExp(firstName,'i')}
           })
           if(emp.length===0){
              return  res.status(400).send({"msg":"employee doenot exits"}) 
           }
           res.status(200).send({"msg":"all search data",employee})
       } catch (error) {
           res.status(400).send({"msg":error.message})
       }
   })



  dashRoutes.patch('/employees/:id', async (req, res) => {
    try {
         const id  = req.params.id;
         let data=  req.body
       

        const emp = await empModel.findByIdAndUpdate({_id:id},data);
        if (!emp) {
            return res.status(404).send({ message: "Employee not Found" });
        }
        return res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});

dashRoutes.delete('/employees/:id', async (req, res) => {
    try {
        const id  = req.params.id;
        const emp = await empModel.findByIdAndDelete({_id:id});
        if (!emp) {
            return res.status(404).send({ message: "Employee doesnpt extis" });
        }
        return res.send({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});


   dashRoutes.get('/dashboard', async (req, res) => {
    try {
      const { page } = req.query;
      const pageSize = 5;
      
      const totalEmployees = await empModel.countDocuments();
      const sIndex = (page - 1) * pageSize;
      const eIndex = page * pageSize;
     const empData = await empModel.find().skip(sIndex).limit(pageSize);
  
      //return res.json({ employees: Employeesdata, totalEmployees },{msg : "emplyee get sucess"});
      return res.send(empData)
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  });



   module.exports={dashRoutes}