var express = require('express');
var router = express.Router();
var path=require('path');
var multer=require('multer')
var fs=require('fs');
var upload=multer({dest:'public/images/'})
var Article=require(path.join(__dirname,'../model/artical.js'))
var Tag=require(path.join(__dirname,'../model/tags.js'))
/* GET home page. */
router.get('/myallArticle', function(req, res, next) {
    var page = req.query.page || 1;
    //分页
    Article.find().skip((page-1)*10).limit(10).then((data)=>{
        //console.log('------',data)
        res.send(data)
    },(err)=>{
        res.send('查找失败')
    })
});

//总条数
router.get('/myCount', function(req, res, next) {
    Article.find().then((data)=>{
        //console.log('------',data)
            res.send(data)
        },(err)=>{
            res.send('查找失败')
        })
});

//添加
router.post('/addArticle',function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
    //console.log('----------bbb-------')
    if(req.body.content==''){
        res.send('发布内容不能为空')
    }else{
        //将发布的文章导入到数据库
         Article.create({data:req.body.date,title:req.body.articleTitle,authod:req.body.authod,id:req.body.id,type:req.body.checkedType,keyword:req.body.keyword,content:req.body.content}).then((data)=>{
            res.send('发布成功')
        },(err)=>{
            res.send('发布失败')
        })

    }
});

//将请求修改的对应文章，返回发到界面
router.get('/alertOldArticle', function(req, res, next) {
    Article.find({_id:req.query._id}).then((data)=>{
        //console.log('------',data)
        res.send(data)
    },(err)=>{
        res.send('查找失败')
    })

});
//将更改数据插入到数据库，并返回数据给前端
router.get('/alertArticle',function(req,res,next) {
    //console.log(req.query)
    Article.update({_id:req.query._id},{$set:{data:req.query.date,title:req.query.articleTitle,authod:req.query.authod,id:req.query.id,type:req.query.checkedType,keyword:req.query.keyword,content:req.query.content}}).then((data)=>{
            res.send('更改成功')
        },(err)=>{
        res.send('更改失败')
    })
})

//删除对应数据
router.get('/removeArticle',(req,res,next)=>{
    Article.remove({_id:req.query._id}).then((data)=>{
        if(data){
            res.send('删除成功')
        }else{
            res.send('删除失败')
        }
    },(err)=>{
        res.send('删除失败')
    })
})
//根据文章类型筛选,
router.get('/selectTypeCount',(req,res,next)=>{
    //console.log('----------')
    //console.log(req.query.type)
    Article.find({type:req.query.type}).then((data)=>{
        res.send(data)
    },(err)=>{
        res.send('查找失败')
    })
})
//分页
router.get('/selectType',(req,res,next)=>{
    //console.log('----------')
    console.log(req.query.type)
    var page = req.query.page || 1;
    Article.find({type:req.query.type}).skip((page-1)*10).limit(10).then((data)=>{
        res.send(data)
    },(err)=>{
        res.send('查找失败')
    })

})
//最新文章查找
router.get('/latelyArticle',(req,res,next)=>{
    Article.find().limit(10).sort({data:-1}).then((data)=>{
        res.send(data)
    },(err)=>{
        res.send('查找失败')
    })
},(err)=>{
    res.send('查找失败')
})

//前端页面数据请求
router.get('/generalArticle',(req,res)=>{
    var page=req.query.page;
    Article.find().skip((page-1)*5).limit(5).sort({data:-1}).then((data)=>{
        res.send(data)
    },(err)=>{
        res.send('未能找到相关数据')
    })
},(err)=>{
    res.send('数据查找失败')
})
//根据文章类型请求数据
router.get('/articleType',(req,res)=>{
    var page = req.query.page || 1;
    //console.log('--------',req.query.type)
    Article.find({type:req.query.type}).skip((page-1)*5).limit(5).then((data)=>{
        console.log('-----',data)
        res.send(data)
    },(err)=>{
        res.send('未能找到相关数据')
    })
},(err)=>{
    res.send('数据查找失败')
})
//每种类型文章数量
router.get('/typeCount', function(req, res, next) {
    Article.find({type:req.query.type}).then((data)=>{
        //console.log('------',data)
            res.send(data)
        },(err)=>{
            res.send('查找失败')
        })
});
//文章详情页
router.get('/detailArticle',(req,res)=>{
    Article.find({_id:req.query._id}).then((data)=>{
        res.send(data[0])
    },(err)=>{
        res.send('未能找到相关数据')
    })
},(err)=>{
    res.send('数据查找失败')
})
//前台页面最新文章查找
router.get('/currentArticle',(req,res)=>{
    Article.find().limit(3).sort({data:-1}).then((data)=>{
        //console.log(1111)
        res.send(data)
    },(err)=>{

    },(err)=>{

    })
})
//关键词搜索
router.get('/searchKeyword',(req,res)=>{
    var page=req.query.page||1
    Article.find({content:{$regex:req.query.keyword}}).skip((page-1)*5).limit(5).then((data)=>{
        res.send(data)
    },(err)=>{
        res.send('未能找到相关数据')
    })
},(err)=>{
    res.send('数据查找失败')
})
//用于返回数量
router.get('/searchKeywordAcount',(req,res)=>{
    Article.find({content:{$regex:req.query.keyword}}).then((data)=>{
        res.send(data)
    },(err)=>{
        res.send('未能找到相关数据')
    })
},(err)=>{
    res.send('数据查找失败')
})

//addTags
router.get('/addTags',(req,res)=>{
    //console.log(req.query.tags)
    Tag.update({},{$push:{"tags":req.query.tags}}).then((data)=>{
        //console.log('1111',data)
         res.send({
            code:1,
            data:'添加成功'
         })
    },(err)=>{
        res.send({
            code:0,
            data:'添加失败'
         })
    })
},(err)=>{
   res.send({
        code:2,
        data:'请求失败'
     })
})
//removeTag
router.get('/removeTags',(req,res)=>{
    console.log(req.query.tags)
    Tag.update({},{$pull:{"tags":req.query.tags}}).then((data)=>{
        //console.log('1111',data)
         res.send({
            code:1,
            data:'删除成功'
         })
    },(err)=>{
        res.send({
            code:0,
            data:'删除失败'
         })
    })
},(err)=>{
   res.send({
        code:2,
        data:'请求失败'
     })
})
//findTag
router.get('/findTags',(req,res)=>{
    Tag.find().then((data)=>{
        //console.log(data)
         res.send({
            code:1,
            data:data
         })
    },(err)=>{
        res.send({
            code:0,
            data:'查找标签失败'
         })
    })
},(err)=>{
   res.send({
        code:2,
        data:'请求失败'
     })
})
router.post('/comments',(req,res)=>{
    //console.log(req.body)
    res.send(req.body)
})
module.exports = router;
