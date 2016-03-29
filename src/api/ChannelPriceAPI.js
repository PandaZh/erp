/**
 * Created by xiaoyi on 2015/4/16.
 */
var when = require('when');
var log             = require('../utils/logUtil');
var dbUtil          = require('../utils/dbPoolUtil');
var resDataUtil     = require('../utils/resDataUtil');
var url             = require('url');
/**
 * 查询app某个渠道的单价设置
 * @param req
 * @param res
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
            name:'media_source',
            type:'NVarChar',
            value:arg.media_source
        }
    ];

    var sql = "exec [runningDbName]..pro_query_channel_cost @app_id, @os, @media_source";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });

}


function delPrice(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'setting_date_id',
            type:'Int',
            value:arg.setting_date_id
        },
        {
            name:'type_id',
            type:'Int',
            value:arg.type_id
        }
    ];

    var sql = "exec [runningDbName].[dbo].[pro_delete_channel_price] @setting_date_id, @type_id"
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else{
                res.end(resDataUtil.error('failed','删除失败'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err));
        });
}

/**
 * 增加app 渠道的固定花费
 * @param req
 * @param res
 * @returns {*}
 */
function addFixedCost(req, res){
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
            name:'media_source',
            type:'NVarChar',
            value:arg.media_source
        },
        {
            name:'price',
            type:'Money',
            value:arg.price
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

    var sql = "exec [runningDbName].[dbo].[pro_add_channel_fixedcost] @app_id, @os , @media_source, @price, @begin_date, @end_date" ;
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.result[0].id > 0){
                res.end(resDataUtil.success(data.result));
            }else  if(data.result[0].id == -1){
                res.end(resDataUtil.error('failed','添加失败，添加的日期与历史数据存在交集'));
            };
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 修改app 渠道的固定花费
 * @param req
 * @param res
 * @returns {*}
 */
function updateFixedCost(req, res){
    var arg = url.parse(req.url, true).query;
    arg.status = arg.status ? arg.status : 1;
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
            name:'media_source',
            type:'NVarChar',
            value:arg.media_source
        },
        {
            name:'price',
            type:'Money',
            value:arg.price
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
            name:'id',
            type:'Int',
            value:arg.id
        },
        {
            name:'status',
            type:'Bit',
            value:arg.status
        }

    ];
    var sql = "exec [runningDbName].[dbo].[pro_update_channel_fixedcost] @app_id, @os, @media_source, @price, @begin_date, @end_date, @id, @status";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else {
                res.end(resDataUtil.error('failed','修改失败'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 删除app 渠道的固定花费
 * @param req
 * @param res
 * @returns {*}
 */
function delFixedCost(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'setting_date_id',
            type:'Int',
            value:arg.id
        }
    ];

    var sql = "exec [runningDbName].[dbo].[pro_delete_channel_fixedCost] @setting_date_id"
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else{
                res.end(resDataUtil.error('failed','删除失败'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err));
        });
}

/**
 * 添加app 渠道的固定单价
 * @param req
 * @param res
 */
function addFixedPrice(req, res){
    var arg = url.parse(req.url, true).query;
    arg.upper_limit =   arg.upper_limit ? arg.upper_limit  : null;
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
            name:'media_source',
            type:'NVarChar',
            value:arg.media_source
        },
        {
            name:'price',
            type:'Money',
            value:arg.price
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
            name:'upper_limit',
            type:'Money',
            value:arg.upper_limit
        }

    ];
    var sql = "exec [runningDbName].[dbo].[pro_add_channel_fixedprice] @app_id, @os , @media_source, @price, @begin_date, @end_date, @upper_limit";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount > 0 && data.result[0].id != -1){
                res.end(resDataUtil.success(data.result));
            }else if(data.result[0].id == -1) {
                res.end(resDataUtil.error('failed','添加失败，添加的日期与历史数据存在交集'));
            }else{
                res.end(resDataUtil.error('failed','添加失败'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 修改app 渠道的固定单价
 * @param req
 * @param res
 * @returns {*}
 */
function updateFixedPrice(req, res){
    var arg = url.parse(req.url, true).query;
    arg.status = arg.status ? arg.status : 1;
    arg.upper_limit =   arg.upper_limit ? arg.upper_limit  : null;
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
            name:'media_source',
            type:'NVarChar',
            value:arg.media_source
        },
        {
            name:'price',
            type:'Money',
            value:arg.price
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
            name:'upper_limit',
            type:'Money',
            value:arg.upper_limit
        },
        {
            name:'id',
            type:'Int',
            value:arg.id
        },
        {
            name:'status',
            type:'Bit',
            value:arg.status
        }

    ];
    var sql = "exec [runningDbName].[dbo].[pro_update_channel_fixedprice] @app_id, @os, @media_source, @price, @begin_date, @end_date, @id, @upper_limit, @status"
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else {
                res.end(resDataUtil.error('failed','修改失败'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });

}

/**
 * 删除app 渠道的固定单价
 * @param req
 * @param res
 * @returns {*}
 */
function delFixedPrice(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'setting_date_id',
            type:'Int',
            value:arg.id
        }
    ];
    var sql = "exec [runningDbName].[dbo].[pro_delete_channel_fixedPrice] @setting_date_id"
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.rowCount > 0){
                res.end(resDataUtil.success(data.result));
            }else{
                res.end(resDataUtil.error('failed','删除失败'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 添加 app 渠道的固定国家花费
 * @param req
 * @param res
 * @returns {*}
 */
function addFixedCountryPrice(req, res){
    var arg = url.parse(req.url, true).query;
    arg.upper_limit =   arg.upper_limit ? arg.upper_limit  : null;
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
            name:'media_source',
            type:'NVarChar',
            value:arg.media_source
        },
        {
            name:'price_str',
            type:'VarChar',
            value:arg.priceStr
        },
        {
            name:'country_str',
            type:'NVarChar',
            value:arg.codeStr
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
            name:'upper_limit',
            type:'Money',
            value:arg.upper_limit
        }

    ];

    var sql = "exec [runningDbName].[dbo].[pro_add_channel_fcp]  @app_id, @os , @media_source, @price_str, @country_str, @begin_date, @end_date, @upper_limit"
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.result[0].id > 0){
                res.end(resDataUtil.success(data.result));
            }else  if(data.result[0].id == -1){
                res.end(resDataUtil.error('failed','添加失败，添加的日期与历史数据存在交集'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 修改app 渠道的固定国家花费
 * @param req
 * @param res
 * @returns {*}
 */
function updateFixedCountryPrice(req, res){
    var arg = url.parse(req.url, true).query;
    arg.upper_limit =   arg.upper_limit ? arg.upper_limit  : null;
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
            name:'media_source',
            type:'NVarChar',
            value:arg.media_source
        },
        {
            name:'price',
            type:'VarChar',
            value:arg.priceStr
        },
        {
            name:'country',
            type:'VarChar',
            value:arg.codeStr
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
        ,
        {
            name:'setting_date_id',
            type:'Int',
            value:arg.id
        } ,
        {
            name:'upper_limit',
            type:'Money',
            value:arg.upper_limit
        }

    ];
    var sql = "exec [runningDbName].[dbo].[pro_update_channel_fcp]  @app_id, @os , @media_source, @price, @country, @begin_date, @end_date, @setting_date_id,1,@upper_limit"
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            if(data.result[0].id > 0){
                res.end(resDataUtil.success(data.result));
            }else  if(data.result[0].id == -1){
                res.end(resDataUtil.error('failed','添加失败，添加的日期与历史数据存在交集'));
            }
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err));
        });
}

/**
 * 删除app 渠道的固定国家花费
 * @param req
 * @param res
 * @returns {*}
 */
function delFixedCountryPrice(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'setting_date_id',
            type:'Int',
            value:arg.id
        }

    ];
    var sql = "exec [runningDbName].[dbo].[pro_delete_channel_fcp] @setting_date_id"
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err))
        });
}

/**
 * 根据配置ID查询固定国家花费详情
 * @param req
 * @param res
 * @returns {*}
 */
function queryFixedCountryPriceById(req, res){
    var arg = url.parse(req.url, true).query;
    var parameters = [
        {
            name:'setting_date_id',
            type:'Int',
            value:arg.id
        }

    ];
    var sql = "SELECT [price],[country] as code, name FROM [runningDbName].[dbo].[t_c_channel_fcp] a " +
        "join [runningDbName].[dbo].t_c_country b on a.country = b.code where a.status = 1 and setting_date_id = @setting_date_id";
    dbUtil.execSQL(sql, parameters)
        .then(function(data){
            res.end(resDataUtil.success(data.result));
        })
        .catch(function (err) {
            res.end(resDataUtil.error('failed',err));
        });

}

var API ={
    addFixedCost: addFixedCost,
    addFixedPrice: addFixedPrice,
    addFixedCountryPrice: addFixedCountryPrice,
    updateFixedCost:updateFixedCost,
    updateFixedPrice:updateFixedPrice,
    updateFixedCountryPrice:updateFixedCountryPrice,
    delFixedCost:delFixedCost,
    delFixedPrice:delFixedPrice,
    delFixedCountryPrice: delFixedCountryPrice,
    queryFixedCountryPriceById:queryFixedCountryPriceById,
    query:query,
    delPrice:delPrice
}
module.exports = API;