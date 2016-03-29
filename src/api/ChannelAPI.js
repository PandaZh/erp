/**
 * Created by xiaoyi on 2015/4/22.
 */
var when            = require('when');
var log             = require('../utils/logUtil');
var dbUtil          = require('../utils/dbPoolUtil');
var resDataUtil     = require('../utils/resDataUtil');
var url             = require('url');

/**
 * 查询渠道详情信息
 * @param req
 * @param res
 * @returns {*}
 */
function query(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'os',
            type:'Int',
            value:arg.os
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'type',
            type:'Int',
            value:arg.type
        }
    ];

    var sql = "exec [runningDbName].dbo.pro_query_channel_detail @app_id, @os, @type, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 查询子渠道信息
 * @param req
 * @param res
 */
function querySonChannel(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'media_source',
            type:'VarChar',
            value:arg.media_source
        }
    ];

    var sql = "exec [runningDbName].dbo.pro_query_son_channel @app_id, @media_source, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 获取一段时间所有的激活、注册、创角、花费
 * @param req
 * @param res
 */
function queryTotalValue(req, res){

    var arg = req.query;

    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'os',
            type:'VarChar',
            value:arg.os
        },
        {
            name:'media_source',
            type:'VarChar',
            value:arg.media_source
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_query_total_data] @app_id, @os, @begin_date, @end_date, @media_source";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            console.dir(data);
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 获取每一天的激活、注册、创角、花费数据
 * @param req
 * @param res
 */
function queryTotalValuePerDay(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'os',
            type:'VarChar',
            value:arg.os
        },
        {
            name:'media_source',
            type:'VarChar',
            value:arg.media_source
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_query_total_install_reg_role_by_appid_ms_date] @app_id, @os, @media_source, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 获取每一天各个渠道(子渠道)的投放数据
 * 跟media_source 是否等于‘_all’来判断查询渠道或者子渠道
 * @param req
 * @param res
 */
function queryDetailValuePerDay(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'os',
            type:'VarChar',
            value:arg.os
        },
        {
            name:'media_source',
            type:'VarChar',
            value:arg.media_source
        }
    ];

    var sql = "exec [runningDbName].dbo.[pro_query_channel_mediaSource_percent] @app_id, @os, @media_source, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 查询表格数据源
 * @param req
 * @param res
 */
function queryAllValueForTable(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'media_source',
            type:'VarChar',
            value:arg.media_source
        },
        {
            name:'os',
            type:'VarChar',
            value:arg.os
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_query_all_data_for_table] @app_id, @os,@media_source, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success({aaData:data.result}));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 查询一段时间内游戏的media source
 * @param req
 * @param res
 */
function queryMediaSource(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'os',
            type:'VarChar',
            value:arg.os
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_query_all_mediaSource] @app_id, @os, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 查询游戏下所有的media_source
 * @param req
 * @param res
 */
function queryGameAllMediaSource(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        }, {
            name:'os',
            type:'Int',
            value:arg.os
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_query_mediaSource_price_setting] @app_id,@os;";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 录入数据（某些渠道的激活、花费等）
 * @param req
 * @param res
 */
function addRepairData(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'count_date',
            type:'Date',
            value:arg.count_date
        },
        {
            name:'media_source',
            type:'VarChar',
            value:arg.media_source
        },
        {
            name:'os',
            type:'Int',
            value:arg.os
        },
        {
            name:'installs',
            type:'Int',
            value:arg.installs
        },
        {
            name:'regs',
            type:'Int',
            value:arg.regs
        },
        {
            name:'cost',
            type:'Money',
            value:arg.cost
        },
        {
            name:'addType',
            type:'Int',
            value:arg['type']
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_add_repair_data] @app_id, @os, @media_source, @installs, @regs, @cost, @count_date, @addType";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            console.dir(data);
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else{
                res.end(resDataUtil.error('failed','录入数据重复，请核实！'))
            }

        })
        .catch(function (err) {
            console.dir(err);
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 录入游戏预算
 * @param req
 * @param res
 */
function addGameBudget(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        }, {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        }, {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        }, {
            name:'budget',
            type:'Money',
            value:arg.budget
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_add_budget_data] @app_id, @budget, @begin_date, @end_date;";

    console.dir(parameters);
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            console.dir(data);
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else{
                res.end(resDataUtil.error('failed','重复录入数据，请核实！'))
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 查询游戏预算
 * @param req
 * @param res
 */
function queryGameBudget(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        }
    ];
    console.dir(parameters);
    var sql = "select app_id, convert(varchar(10), begin_date, 120) begin_date, convert(varchar(10), end_date, 120) end_date, budget from  [runningDbName].[dbo].[t_c_app_budget] where app_id = @app_id order by begin_date desc";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

function delGameBudget(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        }
    ];
    console.dir(parameters);
    var sql = "exec [runningDbName].[dbo].[pro_delete_budget_data] @app_id, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else{
                res.end(resDataUtil.error('failed','删除失败'))
            }

        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 查询游戏的补充数据
 * @param req
 * @param res
 */
function queryRepairData(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        }, {
            name:'count_date',
            type:'VarChar',
            value:arg.count_date
        }, {
            name:'os',
            type:'Int',
            value:arg.os
        }
    ];
    var sql = "exec [runningDbName].[dbo].[pro_query_repair_data] @app_id, @os, @count_date;";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}


/**
 * 查询各个游戏的花费充值情况
 * @param req
 * @param res
 */
function queryTotalCostAndRechargePerGame(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'count_date',
            type:'VarChar',
            value:arg.count_date
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_query_total_cost_and_recharge] @count_date;";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

function delRepairData(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'count_date',
            type:'VarChar',
            value:arg.count_date
        },
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'os',
            type:'Int',
            value:arg.os
        },
        {
            name:'media_source',
            type:'VarChar',
            value:arg.media_source
        },
        {
            name:'link_media_source',
            type:'VarChar',
            value:arg.link_media_source
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_del_repair_data] @count_date,@app_id, @os, @media_source, @link_media_source;";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}
/**
 * 查询备注信息- 渠道详情模块
 * @param req
 * @param res
 */
function queryRemark(req, res){
    var arg = req.query;
    var parameters = [
        {
            name:'app_id',
            type:'Int',
            value:arg.app_id
        },
        {
            name:'begin_date',
            type:'Date',
            value:arg.begin_date
        },
        {
            name:'end_date',
            type:'Date',
            value:arg.end_date
        },
        {
            name:'os',
            type:'VarChar',
            value:arg.os
        }
    ];
    var sql = "exec [runningDbName].dbo.[pro_query_remark] @app_id, @os, @begin_date, @end_date";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
};
var API ={
    queryTotalValue:queryTotalValue,
    queryTotalValuePerDay:queryTotalValuePerDay,
    queryDetailValuePerDay:queryDetailValuePerDay,
    query: query,
    querySonChannel: querySonChannel,
    queryAllValueForTable:queryAllValueForTable,
    queryMediaSource:queryMediaSource,
    queryGameAllMediaSource:queryGameAllMediaSource,
    addRepairData:addRepairData,
    queryRepairData:queryRepairData,
    addGameBudget:addGameBudget,
    delGameBudget:delGameBudget,
    queryGameBudget:queryGameBudget,
    queryTotalCostAndRechargePerGame:queryTotalCostAndRechargePerGame,
    delRepairData:delRepairData,
    queryRemark:queryRemark
}

module.exports = API;