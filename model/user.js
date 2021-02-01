var mongoose=require('mongoose');
var Admin=mongoose.model('Admin',{
    admin:String,
    password:String
})
module.exports=Admin;