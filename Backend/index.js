const express= require("express")
const {connection}=require("./Config/db")
const {userRoutes}=require("./Routes/user.routes")
const {dashRoutes}=require("./Routes/dash.routes")
const {auth}=require("./Middleware/auth")
const cors=require("cors")





const app= express()
app.use(express.json())
app.use(cors())



app.get("/" ,async(req,res)=>{

           try {
             res.status(200).send("Welcome to emplyee manage ment system")
           } catch (error) {
             res.send({"msg":error.message})
            
           }
})


app.use("/",userRoutes)
app.use("/",auth,dashRoutes)





app.listen(process.env.PORT, async(req,res)=>{
              
                try {
                     await connection 
                      console.log("Connected to databse")
                } catch (error) {

                    console.log(error)
                    
                }
                console.log("Server is running")
})