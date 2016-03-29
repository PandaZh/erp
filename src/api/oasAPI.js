/**
 * Created by xiaoyi on 2015/8/4.
 */
var when            = require('when');
var log             = require('../utils/logUtil');
var dbUtil          = require('../utils/dbPoolUtil');
var resDataUtil     = require('../utils/resDataUtil');
var url             = require('url');
/**
 * 五分钟注册数据
 * @param req
 * @param res
 */
function fiveMinRegData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','date1','date2','date3'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_5min_reg($1,$2,$3,$4,$5)';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 五分钟充值数据
 * @param req
 * @param res
 */
function fiveMinRechargeData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','date1','date2','date3'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_5min_pay($1,$2,$3,$4,$5)';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 五分钟在线数据
 * @param req
 * @param res
 */
function fiveMinOnlineData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','date1','date2','date3'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_5min_online($1,$2,$3,$4,$5)';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 获取指标趋势看盘 日数据
 * @param req
 * @param res
 */
function indicatortrendDayData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','date1','date2','paychannel','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_oas_kanpan_day($1,$2,$3,$4,$5,$6)';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 获取指标趋势看盘 周数据
 * @param req
 * @param res
 */
function indicatortrendWeekData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','date1','date2','paychannel','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_oas_kanpan_week($1,$2,$3,$4,$5,$6)';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 获取指标趋势看盘 月数据
 * @param req
 * @param res
 */
function indicatortrendMonthData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','date1','date2','paychannel','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_oas_kanpan_month($1,$2,$3,$4,$5,$6);';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}



/**
 * 日留存
 * @param req
 * @param res
 */
function liucun(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','date1','date2','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_oas_liucun_day($1,$2,$3,$4,$5);';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 一日节点留存
 * @param req
 * @param res
 */
function stepLostOneDay(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','curDate','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_oas_steplost_oneday($1,$2,$3,$4);';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 二日节点留存
 * @param req
 * @param res
 */
function stepLostTwoDay(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','curDate','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_oas_steplost_twoday($1,$2,$3,$4);';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 七日日节点留存
 * @param req
 * @param res
 */
function stepLostSevenDay(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','curDate','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = 'SELECT * from sc_game_dw_data.fn_oas_steplost_sevenday($1,$2,$3,$4);';
    dbUtil.execSQL(sql, params, 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}


/**
 * 五力模型 日数据
 * @param req
 * @param res
 */
function fiveForceDayData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','curDate','paychannel','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    console.dir(params);
    var sql = "SELECT * from sc_game_dw_data.fn_oas_fivepower_day("+params[0]+","+params[1]+",'"+params[2]+"','"+params[3]+"','"+params[4]+"','refcursor');FETCH ALL IN refcursor;";
    console.log(sql);
    dbUtil.execSQL(sql, [], 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            console.dir(err);
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 五力模型 周数据
 * @param req
 * @param res
 */
function fiveForceWeekData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','curDate','paychannel','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = "SELECT * from sc_game_dw_data.fn_oas_fivepower_week("+params[0]+","+params[1]+",'"+params[2]+"','"+params[3]+"','"+params[4]+"','refcursor');FETCH ALL IN refcursor;";
    //var sql = "SELECT * from sc_game_dw_data.fn_oas_fivepower_week($1,$2,$3,$4,$5,'refcursor');FETCH ALL IN refcursor;"
    dbUtil.execSQL(sql, [], 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 五力模型 月数据
 * @param req
 * @param res
 */
function fiveForceMonthData(req, res){
    var arg = req.query;
    var paramKeys = ['game_id','agent_id','curDate','paychannel','regchannel'];
    var params = [];
    for(var i = 0; i < paramKeys.length; i++){
        params.push(arg[paramKeys[i]]);
    }
    var sql = "SELECT * from sc_game_dw_data.fn_oas_fivepower_month("+params[0]+","+params[1]+",'"+params[2]+"','"+params[3]+"','"+params[4]+"','refcursor');FETCH ALL IN refcursor;";
    //var sql = "SELECT * from sc_game_dw_data.fn_oas_fivepower_month($1,$2,$3,$4,$5,'refcursor');FETCH ALL IN refcursor;";
    dbUtil.execSQL(sql, [], 'pg')
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
var API ={
    liucun:liucun,
    stepLostTwoDay:stepLostTwoDay,
    stepLostOneDay:stepLostOneDay,
    stepLostSevenDay:stepLostSevenDay,
    fiveMinRegData:fiveMinRegData,
    fiveMinRechargeData:fiveMinRechargeData,
    fiveMinOnlineData:fiveMinOnlineData,
    indicatortrendDayData:indicatortrendDayData,
    indicatortrendWeekData:indicatortrendWeekData,
    indicatortrendMonthData:indicatortrendMonthData,
    fiveForceDayData:fiveForceDayData,
    fiveForceWeekData:fiveForceWeekData,
    fiveForceMonthData:fiveForceMonthData
}
module.exports = API;