var mongoose=require('mongoose');
var Tag=mongoose.model('Tag',{
    tags:Array
})
module.exports=Tag;