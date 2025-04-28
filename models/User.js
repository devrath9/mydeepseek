import mongoose from 'mongoose'

const Userschema = new mongoose.Schema({

       _id:{type:String, required:true},
       name:{type:String, required:true},
       email:{type:String, required:true},
       image:{type:String, required:false},
       
},
{timestamps:true}
);

const User = mongoose.models.User || mongoose.model('User', Userschema)

export default User