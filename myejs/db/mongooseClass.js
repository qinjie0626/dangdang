const mongoose = require('mongoose')
class mongooseFun{
    constructor(host,prot,uname){
        this.tableModel = {}//存模型为了优化，不用每次调用一次add函数就创建一次模型
        this.model = {}//创建模型
        mongoose.connect(`mongodb://${host}:${prot}/${uname}`,{useUnifiedTopology: true,useNewUrlParser:true})
        this.table = require('./tab.json')
    }
    getSchema(tname){
        let schema = new mongoose.Schema(this.table[tname])
        this.model = this.tableModel[tname]
        if(!this.model){//判断模型是否创建如果没有就创建执行下面的代码
            this.model = mongoose.model(tname,schema)
            this.tableModel[tname] = this.model
        }
    }
    /**
     * 添加数据
     * @param {string} tname 表名
     * @param {object} files  添加的数据
     * @param {function} callback 回调函数
     */
    add(tname,files,callback){
        this.getSchema(tname)
        this.model.create(files,(err)=>{
            callback(err)
        })
    }
    /**
     * 修改数据
     * @param {string} tname 表名
     * @param {object} term 条件
     * @param {object} cont 要修改的具体内容
     * @param {function} callback 回调函数
     */
    upDate(tname,term,cont,callback){
        this.getSchema(tname)
        this.model.update(term,cont,{ multi: true },(err,docs)=>{
            callback(err,docs)
        })
    }
    /**
     * 查询符合条件数据
     * @param {string} tname 表名
     * @param {object} term 条件
     * @param {object} files 要保留的字段
     * @param {object} solp 要执行的操作 limit() sort() skip()
     * @param {function} callback 回调函数
     */
    search(tname,term,files,solp,callback){
        this.getSchema(tname)
        this.model.find(term,files,solp,(err,docs)=>{
            callback(err,docs)
        })
    }
    /**
     * 删除符合条件的数据
     * @param {string} tname 表名
     * @param {object} term 条件
     * @param {function} callback 回调函数
     */
    del(tname,term,callback){
        this.getSchema(tname)
        //从集合中删除所有匹配的文档
        this.model.deleteMany(term,(err)=>{
            callback(err)
        })
    }
    contSearch(tname,term,callback){
        this.getSchema(tname)
        this.model.countDocuments(term,(err, count)=>{
            callback(err, count)
        })
    }
}
module.exports = new mongooseFun("localhost",27017,"library")