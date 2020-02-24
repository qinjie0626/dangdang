const express = require('express');
var multiparty = require('multiparty')
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId
//引入操作mongodb数据库类
const dbObj = require('../db/mongooseClass');
// 登录页面
router.get('/login', function (req, res, next) {
  let arg = req.query.arg
    if (arg == "logincur") {
        delete req.session.CURUSR
    }
  res.render('login.html');
});
router.post('/login', (req, res) => {
  let { name, password, check } = req.body
  if(check){
    const secret = '321!@#$abcd'; //密钥
    password = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    dbObj.search('user', { name }, {}, {}, (err, data) => {
      console.log(data)
        if (data.length >= 1) {
            if (password == data[0].password) {
                req.session.CURUSR = name;
                res.render('404.html', { "tip": "登录成功", "url": "/" });
            } else {
                res.render('404.html', { "tip": "密码错误", "url": "/login" });
            }
        } else {
            res.render('404.html', { "tip": "帐号不正确", "url": "/login" });
        }
    })
  }else{
    res.render('404.html', { "tip": "请勾选同意协议", "url": "/login" });
  }
})
router.get('/adduser', (req, res) => {
  let usr = req.session.CURUSR
  res.render('admin.html', { usr });
})
router.post('/adduser', (req, res) => {
  console.log(req.body)
  let { password } = req.body;
  console.log(password)
  const secret = '321!@#$abcd'; //密钥
  password = crypto.createHmac('sha256', secret)
      .update(password)
      .digest('hex');
  req.body.password = password;
  dbObj.add('user', req.body, (err) => {
      if (err) {
          res.render('404.html', { tip: "添加失败", url: "/adduser" })
      } else {
          res.render('404.html', { tip: "添加成功", url: "/login" })
      }
  })
})
router.get('/getuseradd', (req, res) => {
  //接收参数(用户名)
  let user = req.query.curusr;
  dbObj.search('user', { name: user }, {}, {}, (error, datas) => {
      if (datas.length == 1) { //已注册 
          res.send({ "flag": true, "msg": "帐号已注册 " });
      } else { //未注册 
          res.send({ "flag": false, "msg": "帐号未注册  " });
      }
  });
});
// 分类列表展示
router.get('/', function (req, res, next) {
  let usr = req.session.CURUSR
  dbObj.search('booklist', {}, {}, {}, (err, datas) => {
    res.render('index.html', { data: datas,usr });
  });
});

// 添加分类页面
router.get('/addPage', function (req, res, next) {
  let usr = req.session.CURUSR
  res.render('edit.html',{usr});
});

// 分类列表搜索
router.post('/seatchClass', function (req, res, next) {
  let name = req.body.name
  let usr = req.session.CURUSR
  dbObj.search('booklist', { name }, {}, {}, (err, datas) => {
    res.render('index.html', { data: datas,usr });
  });
});

// 添加分类
router.post('/doadd', function (req, res, next) {
  let form = new multiparty.Form({ uploadDir: "upload" })
  form.parse(req, function (err, fields, files) {
    let img = files.img[0].path
    if (files.img[0].originalFilename == "") {
      fs.unlink(img, function () { })
      fields.img = ""
    } else {
      fields.img = img
    }
    fields.name = fields.name[0]
    dbObj.add('booklist', fields, (err) => {
      if (err) { //添加失败
        fs.unlink(img, function () { })
        res.send('<script>alert("添加失败");location.href="/addPage";</script>');
      } else { //添加成功
        res.send('<script>alert("添加成功");location.href="/";</script>');
      }
    })
  })
})
// 修改分类页面
router.get('/updataPage', function (req, res) {
  let _id = ObjectId(req.query.id)
  let usr = req.session.CURUSR
  dbObj.search('booklist', { _id }, {}, {}, (err, datas) => {
    res.render('updataEdit.html', { data: datas,usr });
  });
});
// 修改分类
router.post('/doupdata', function (req, res, next) {
  let form = new multiparty.Form({ uploadDir: "upload" })
  form.parse(req, function (err, fields, files) {
    let img = files.img[0].path
    let _id = fields._id[0]
    if (files.img[0].originalFilename != "") {
      fields.img = img
    } else {
      fs.unlink(img, function () { })
      fields.img = fields.oldimg[0]
    }
    fields.name = fields.name[0]
    delete fields.oldimg
    dbObj.upDate('booklist', { _id }, fields, (err, datas) => {
      if (err) {
        fs.unlink(img, function () { })
        res.send('<script>alert("修改失败");location.href="/updataPage";</script>');
      } else { //添加成功
        res.send('<script>alert("修改成功");location.href="/";</script>');
      }
    })
  })
})
// 删除分类
router.get('/delete', function (req, res) {
  // res.send('111');
  let _id = ObjectId(req.query.id)
  dbObj.del('booklist', { _id }, (err, datas) => {
    if (err) {
      res.send('<script>alert("删除失败");location.href="/addPage";</script>');
    } else {
      res.send('<script>alert("删除成功");location.href="/";</script>');
    }
  })
});
/* ===============================商品列表展示================================ */
router.get('/goods', function (req, res, next) {
  let usr = req.session.CURUSR
  dbObj.search('goodslist', {}, {}, {}, (err, datas) => {
    res.render('goods.html', { data: datas,usr });
  });
});
// 
router.get('/addgoods', function (req, res, next) {
  let usr = req.session.CURUSR
  res.render('addgoods.html',{usr});
});
// 搜索商品
router.post('/seatchGoods', function (req, res, next) {
  let name = req.body.name
  let usr = req.session.CURUSR
  dbObj.search('goodslist', { name }, {}, {}, (err, datas) => {
    res.render('goods.html', { data: datas,usr });
  });
});
// 添加商品
router.post('/dogoodsadd', function (req, res, next) {
  let form = new multiparty.Form({ uploadDir: "upload" })
  form.parse(req, function (err, fields, files) {
    let img = files.img[0].path
    console.log(files)
    if (files.img[0].originalFilename == "") {
      fs.unlink(img, function () { })
      fields.img = ""
    } else {
      fields.img = img
    }
    fields.name = fields.name[0]
    fields.state = fields.state[0]
    fields.type = fields.type[0]
    fields.describe = fields.describe[0]
    fields.author = fields.author[0]
    fields.price = parseInt(fields.price[0])
    fields.count = parseInt(fields.count[0])
    dbObj.add('goodslist', fields, (err) => {
      if (err) { //添加失败
        fs.unlink(img, function () { })
        res.send('<script>alert("添加失败");location.href="/addgoods";</script>');
      } else { //添加成功
        res.send('<script>alert("添加成功");location.href="/goods";</script>');
      }
    })
  })
})
// 修改商品页面
router.get('/goodsupdataPage', function (req, res) {
  let _id = ObjectId(req.query.id)
  let usr = req.session.CURUSR
  dbObj.search('goodslist', { _id }, {}, {}, (err, datas) => {
    res.render('goodsupdataPage.html', { data: datas,usr });
  });
});
// 修改商品
router.post('/dogoodsupdata', function (req, res, next) {
  let form = new multiparty.Form({ uploadDir: "upload" })
  form.parse(req, function (err, fields, files) {
    let img = files.img[0].path
    let _id = fields._id[0]
    if (files.img[0].originalFilename != "") {
      fields.img = img
    } else {
      fs.unlink(img, function () { })
      fields.img = fields.oldimg[0]
    }
    fields.name = fields.name[0]
    fields.state = fields.state[0]
    fields.type = fields.type[0]
    fields.describe = fields.describe[0]
    fields.author = fields.author[0]
    fields.price = parseInt(fields.price[0])
    fields.count = parseInt(fields.count[0])
    delete fields.oldimg
    console.log(fields)
    dbObj.upDate('goodslist', { _id }, fields, (err, datas) => {
      if (err) {
        fs.unlink(img, function () { })
        res.send('<script>alert("修改失败");location.href="/goodsupdataPage";</script>');
      } else { //添加成功
        res.send('<script>alert("修改成功");location.href="/goods";</script>');
      }
    })
  })
})
// 删除商品
router.get('/goodsdelete', function (req, res) {
  // res.send('111');
  let _id = ObjectId(req.query.id)
  dbObj.del('goodslist', { _id }, (err, datas) => {
    if (err) {
      res.send('<script>alert("删除失败");location.href="/goods";</script>');
    } else {
      res.send('<script>alert("删除成功");location.href="/goods";</script>');
    }
  })
})
module.exports = router;
