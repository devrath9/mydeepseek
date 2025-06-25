import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({

       
       name:{type:String, required:true,minlength: [3, "Chat name must be at least 3 characters long"]},
       messages:[
        {
          role:{type:String, required:true},
          content:{type:String, required:true},
          timestamp:{type:Number, required:true},
        },
       ],
       userId:{type:String, required:true}
       
       
},
{timestamps:true}
);

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema)

export default Chat