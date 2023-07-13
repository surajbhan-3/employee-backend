const mongoose= require("mongoose")



const empSchema=mongoose.Schema({

      firstName:{type:String, required:true},
      lastName:{type:String, required:true},
      email:{type:String, required:true},
      department: { type: String, enum: ['Tech', 'Marketing', 'Operations'] },
      salary: {
        type: Number
      }
})

const empModel=mongoose.model("user-emp",empSchema)


module.exports={empModel}