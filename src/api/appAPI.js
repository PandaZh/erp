/**
 * Created by xiaoyi on 2015/4/15.
 */
var when            = require('when');
var log             = require('../utils/logUtil');
var dbUtil          = require('../utils/dbPoolUtil');
var resDataUtil     = require('../utils/resDataUtil');
var url             = require('url');
/**
 * 查询所有app 包列表
 * @param req
 * @param res
 */
function query(req, res){
    var sql = 'select id, app_id, app_name, package_name, os from [runningDbName].dbo.t_c_app_package where [status] = 1';
    dbUtil.execSQL(sql)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 查询所有游戏
 * @param req
 * @param res
 */
function queryGames(req, res){
    var sql = 'select distinct game_id,game_name from oas_system_2_0.dbo.t_pdm_channel';
    dbUtil.execSQL(sql)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 修改app信息
 * @param req
 * @param res
 */
function updateApp(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'id',
            type:'Int',
            value:arg.id
        },
        {
            name:'app_name',
            type:'NVarChar',
            value:arg.app_name
        },
        {
            name:'package_name',
            type:'NVarChar',
            value:arg.package_name
        },
        {
            name:'os',
            type:'Int',
            value:arg.os
        }

    ];
    var sql = "update [runningDbName].dbo.t_c_app_package  set app_name = @app_name, os = @os,package_name =@package_name, modify_time = getdate() where id = @id" ;
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount>0){
                res.end(resDataUtil.success('ok'));
            }else{
                res.end(resDataUtil.error('failed','update failed, rowCount <= 0'))
            };
        })
        .catch(function (err) {
            log.error(err);
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 添加app
 * @param req
 * @param res
 */
function addApp(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'app_name',
            type:'NVarChar',
            value:arg.app_name
        },
        {
            name:'package_name',
            type:'NVarChar',
            value:arg.package_name
        },
        {
            name:'os',
            type:'Int',
            value:arg.os
        }

    ];

    var sql = "exec [runningDbName].dbo.pro_add_app @app_id, @app_name, @package_name, @os" ;
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            console.dir(data);
            if(data.rowCount > 0 && data.result[0].id > 0){
                res.end(resDataUtil.success('ok'));
            }else{
                res.end(resDataUtil.error('failed','添加游戏package重复，请核实！'))
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });

}

/**
 * 删除app
 * @param req
 * @param res
 */
function deleteApp(req, res){
    var arg = url.parse(req.url, true).query;
    var id = arg.id;
    var parameters = [
        {
            name:'id',
            type:'Int',
            value:id
        }];
    var sql = "update [runningDbName].dbo.t_c_app_package  set [status] = 0  where id = @id";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount>0){
                res.end(resDataUtil.success('ok'));
            }else{
                res.end(resDataUtil.error('failed','添加包名重复'))
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

var appAPI ={
    addApp: addApp,
    deleteApp: deleteApp,
    updateApp: updateApp,
    query:query,
    queryGames:queryGames
}

module.exports = appAPI;