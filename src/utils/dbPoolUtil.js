/**
 * Created by xiaoyi on 2015/4/9.
 */
var when        = require('when');
var postgreUtil = require('./postgreUtil');
var mssqlUtil   = require('./mssqlUtil');

function execSQL(sql, parameters, dbPoolId){
    var deffered = when.defer();
    if(!dbPoolId){ // 默认为mssql数据库
        mssqlUtil.execSQL(sql, parameters)
            .then(function(data){
                deffered.resolve(data);
            })
            .catch(function(err){
                deffered.reject(err);
            });
    }else if(dbPoolId ==='pg'){ // postgre数据库
        postgreUtil.query(sql, parameters)
            .then(function(data){
                deffered.resolve(data);
            })
            .catch(function(err){
                deffered.reject(err);
            });
    }

    return deffered.promise;
}

var dbUtil = {
    execSQL             : execSQL
}


module.exports = dbUtil;