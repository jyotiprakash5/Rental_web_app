const mongoose = require('mongoose');
const plm=require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/newapp');
const userSchema=new mongoose.Schema({
 username:{
  type:String,
  required:true,
  unique:true
 },
 password:{
  type:String
 },
 Phonenumber:{
  type:String
 },
 post:[{
  type:mongoose.Schema.Types.ObjectId,// Ensures that post is an object
  ref:'Post'
 }],
 dp:{
  type:String
 },
 email:{
  type:String,
  required:true,
  unique:true
 },
 fullname:{
  type:String,  
  required:true
 }
});

userSchema.plugin(plm);
module.exports=mongoose.model('User',userSchema);

