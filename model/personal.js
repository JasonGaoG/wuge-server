var mongoose=require('mongoose');
var Personal=mongoose.model('Personal',{
    nick:String,
    address:String,
    email:String
})
module.exports=Personal;