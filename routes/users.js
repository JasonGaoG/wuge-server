var express = require('express');
var router = express.Router();
var path=require('path');
var Admin=require(path.join(__dirname,'../model/user.js'))
var Personal=require(path.join(__dirname,'../model/personal.js'))
/* GET users listing. */
//验证用户登录信息
router.get('/myadmin', function(req, res, next) {

  //console.log('----------',req.query.username)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    //发送过来的数据与数据库的信息进行判断
   if(req.query.username==''|| req.query.password=='') {
        res.send('用户名或密码不能为空')
    }else{
         //console.log(00);
        Admin.findOne({admin:req.query.username}).then((data)=>{
             //console.log(2);
                if(data){
                    if(data.password==req.query.password){
                        res.send('登录成功')
                    }else{
                        //console.log(0);
                        res.send('密码错误')
                    }
                }else{
                     //console.log(1);
                   res.send('用户名错误')
                }
            },(err)=>{
                res.send(err)
            })
        }
});
//修改密码
router.post('/changePassword',(req,res)=>{
    console.log(req.body)
    if(req.body.newPassword==req.body.confirmPassword){
        Admin.update({},{$set:{admin:req.body.admin,password:req.body.confirmPassword}}).then((data)=>{
          res.send('修改成功')
        },(err)=>{
          res.send('修改失败')
        })
    }else{
      res.send('两次密码输入不一样，请重新输入')
    }
},(err)=>{
    res.send('请求失败')
})

//查询个人资料
router.get('/personal',(req,res)=>{
    Personal.find().then((data)=>{
      res.send(data[0])
    },(err)=>{
      res.send('个人资料查找失败')
    })
})
//更改个人资料
router.get('/changePersonal',(req,res)=>{
    //console.log('--------',req.query)
    if(req.query.nick==''){
      res.send('昵称用于后台登陆，不能为空')
    }else{
        Personal.update({_id:req.query._id},{$set:req.query}).then((data)=>{
          //console.log('=====',data)
          res.send('更改成功')
        },(err)=>{
          res.send('更改失败')
        })
    }

},(err)=>{
  res.send('更改失败')
})

module.exports = router;
