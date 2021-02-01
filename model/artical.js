var mongoose=require('mongoose');
var Article=mongoose.model('Article',{
    data:String,
    title:String,
    authod:String,
    id:Number,
    type:String,
    keyword:String,
    content:String
})
module.exports=Article;