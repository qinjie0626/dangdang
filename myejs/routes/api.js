const express = require('express')
const router = express.Router();
const multiparty = require('multiparty')
const fs = require('fs');

//引入操作mongodb数据库类
const dbObj = require('../db/mongooseClass');
router.get('/wxapiclassify', (req, res) => {
    dbObj.search('booklists', {}, {}, {}, (err, data) => {
        res.send(data)
    })
})
router.get('/wxapibanner', (req, res) => {
    dbObj.search('banner', {}, {}, {}, (err, data) => {
        res.send(data)
    })
})
router.get('/wxapibook', (req, res) => {
    dbObj.search('goodslist', {}, {}, {}, (err, data) => {
        res.send(data)
    })
})
router.get('/wxapibookone', (req, res) => {
    let _id = req.query.id
    console.log(_id)
    dbObj.search('goodslist', { _id }, {}, {}, (err, data) => {
        res.send(data)
    })
})
router.get('/wxapibooklist', (req, res) => {
    let type = req.query.type
    dbObj.search('goodslist', { type }, {}, {}, (err, data) => {
        if (data.length <= 0) {
            res.send({ count: 0, content: "查询为空" })
        } else {
            res.send({ count: 1, content: "查询成功", data })
        }

    })
})
router.get('/wxapiShoppingcar', (req, res) => {
    dbObj.search('goodslist', { _id: req.query.id }, {}, {}, (err, data) => {
        let arr = {}
        arr._id = data[0]._id
        arr.value = 1
        arr.name = data[0].name
        arr.img = data[0].img
        arr.price = data[0].price
        if (data.length == 0) {
            dbObj.add('carlist', arr, (error) => {
                if (error) { //添加失败
                    res.send({
                        code: 0,
                        msg: "添加失败"
                    });
                } else { //添加成功
                    res.send({
                        code: 1,
                        msg: "添加成功"
                    });
                }
            })
        } else {
            dbObj.search('carlist', {}, {}, {}, (err, datas)=>{
                console.log(datas)
                let i;
                let bool = datas.some((item, index) => {
                    if (item.name == arr.name) {
                        i = index;
                        return true;
                    } else {
                        return false;
                    }
                });
                console.log(bool)
                if (bool) {
                    let value = datas[i].value + 1;
                    dbObj.upDate('carlist',{_id:datas[i]._id},{value},(err)=>{
                        if (err) { //修改失败
                            res.send({
                                code: 0,
                                msg: "修改失败"
                            });
                        } else { //修改成功
                            res.send({
                                code: 1,
                                msg: "修改成功"
                            });
                        }
                    })
                } else {
                    dbObj.add('carlist', arr, (error) => {
                        if (error) { //添加失败
                            res.send({
                                code: 0,
                                msg: "添加失败"
                            });
                        } else { //添加成功
                            res.send({
                                code: 1,
                                msg: "添加成功"
                            });
                        }
                    })
                }
            })
        }
    })
})
router.get('/wxapishoppingList', (req, res) => {
    dbObj.search('carlist', {}, {}, {}, (err, data) => {
        res.send(data)
    })
})
router.get('/wxapideleteshopping', (req, res) => {
    console.log(req.query.id)
    let id = req.query.id
    dbObj.del('carlist', {_id:id}, (err, data) => {
        if (err) { //删除失败
            res.send({
                code: 0,
                msg: "删除失败"
            });
        } else { //删除成功
            res.send({
                code: 1,
                msg: "删除成功"
            });
        }
    })
})
module.exports = router;