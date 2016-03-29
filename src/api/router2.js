/**
 * Created by xiaoyi on 2015/4/15.
 */

var Router = require('router')
var when = require('when');
var AppAPI = require('./appAPI');
var ChannelPriceAPI = require('./ChannelPriceAPI');
var ChannelAPI = require('./ChannelAPI');
var CountryAPI = require('./countryAPI');
var UploadAPI = require('./upload');
var OasAPI = require('./oasAPI');
var userAPI = require('./userAPI');
var SDKAPI = require('./SDKAPI');
var ReportMapAPI = require('./reportMapAPI');
var ChannelRemarkAPI = require('./ChannelRemarkAPI');
var sessionMiddleware = require('../common/sessionMiddleware');
var accessMiddleware = require('../common/accessMiddleware');
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();
module.exports = function (app) {

    /**
     * 用户登录接口
     */
        //app.get('/login', sessionMiddleware.support, function (req, res) {
        //    var session = req.session;
        //    session.set('username','xiaoyi');
        //    session.set('admin','true');
        //    //res.end("已获得管理员权限，session时效2小时。主页地址：http://192.168.60.84:3000/index.html#/app/main");
        //    //res.render('index', { msg: '已获得管理员权限，session时效2小时。过时请刷新！', url:'http://www.baidu.com' });
        //    res.sendStatus(200);
        //});
    app.get('/api/user/login', sessionMiddleware.support, userAPI.getUserAccess);

    /**
     * 【APP包名配置】查询接口
     */
    app.get('/api/app', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, AppAPI.query);

    app.get('/api/games', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, AppAPI.queryGames);
    /**
     * 【APP包名配置】修改接口
     */
    app.get('/api/app/update', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, AppAPI.updateApp);

    /**
     * 【APP包名配置】删除接口
     */
    app.post('/api/app/delete', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, AppAPI.deleteApp);

    /**
     * 【APP包名配置】增加接口
     */
    app.post('/api/app/add', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, AppAPI.addApp);

    /**
     * 查询渠道定价
     */
    app.get('/api/channelPrice', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelPriceAPI.query);

    /**
     * 删除花费
     */
    app.post('/api/channelPrice/delete', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelPriceAPI.delPrice);

    /**
     * 增加固定花费
     */
    app.post('/api/channelPrice/cfc/add', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelPriceAPI.addFixedCost);


    /**
     * 增加固定单价
     */
    app.post('/api/channelPrice/cfp/add', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelPriceAPI.addFixedPrice);


    /**
     * 查询固定国家价格
     */
    app.get('/api/channelPrice/cfcp/query', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelPriceAPI.queryFixedCountryPriceById);

    /**
     * 增加固定国家价格
     */

    app.post('/api/channelPrice/cfcp/add', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelPriceAPI.addFixedCountryPrice);


    /**
     * 获取国家列表
     */
    app.get('/api/country', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, CountryAPI.query);

    /**
     * 获取status = 1的国家列表
     */
    app.get('/api/country/use', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, CountryAPI.queryUseCountry);

    /**
     * 批量修改国家的状态
     */
    app.post('/api/country/update', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, CountryAPI.updateCountryStatus);

    /**
     * 获取渠道详情
     */
    app.get('/api/channel/detail', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, sessionMiddleware.support, sessionMiddleware.checkUser, ChannelAPI.query);

    /**
     * 获取该段时间所有的投放数据
     */
    app.get('/api/channel/total', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryTotalValue);
    /**
     * 获取该段时间每天的投放数据
     */
    app.get('/api/channel/total/perday', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryTotalValuePerDay);
    /**
     * 获取该段时间每天渠道(子渠道)的投放占比
     */
    app.get('/api/channel/detail/perday', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryDetailValuePerDay);
    /**
     * 获取该段时间每天渠道(子渠道)的投放数据-所有纬度
     */
    app.get('/api/channel/all', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryAllValueForTable);

    /**
     * 获取该段时间，游戏、类型下的数据备注
     */
    app.get('/api/channel/remark', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryRemark);

    /**
     * 获取游戏机型下的所有备注信息
     */
    app.get('/api/channel/remark/list', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelRemarkAPI.queryList);

    app.post('/api/channel/remark/add', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelRemarkAPI.add);

    app.post('/api/channel/remark/update', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelRemarkAPI.update);

    app.post('/api/channel/remark/delete', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelRemarkAPI.delete);
    /**
     * 查询一段时间内，某游戏os下的所有Media source
     */
    app.get('/api/media_source/query', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryMediaSource);

    /**
     * 查询游戏下所有的media source
     */
    app.get('/api/app/media_source/All', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryGameAllMediaSource);

    /**
     * 渠道手动录入激活、注册、花费
     */
    app.post('/api/channel/data/repair/add', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.addRepairData);


    app.post('/api/upload/channel-repair-data', UploadAPI.uploadCSVForChanneDataRepair);
    /**
     * 根据时间、app_id、os查询录入数据
     */
    app.get('/api/channel/data/repair/query', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryRepairData);
    /**
     * 删除补充数据
     */
    app.post('/api/channel/data/repair/delete', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.delRepairData);
    /**
     * 增加游戏预算
     */
    app.post('/api/app/data/budget/add', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.addGameBudget);
    /**
     * 查询预算信息
     */
    app.get('/api/app/data/budget/query', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryGameBudget);

    /**
     * 删除预算信息
     */
    app.post('/api/app/data/budget/delete', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.delGameBudget);

    /**
     * HOME页查询 各个游戏花费、充值数据
     */
    app.get('/api/app/cost-recharge', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, ChannelAPI.queryTotalCostAndRechargePerGame);
    /**
     * 分析系统 五分钟注册数据
     */
    app.get('/api/oas/5min-reg', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.fiveMinRegData);
    /**
     * 分析系统 五分钟充值数据
     */
    app.get('/api/oas/5min-recharge', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.fiveMinRechargeData);

    /**
     * 分析系统 五分钟在线数据
     */
    app.get('/api/oas/5min-online', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.fiveMinOnlineData);

    /**
     * 分析系统 次日留存数据
     */
    app.get('/api/oas/liucun', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.liucun);
    /**
     * 分析系统 指标趋势看盘 日数据
     */
    app.get('/api/oas/trend-day', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.indicatortrendDayData);
    /**
     * 分析系统 指标分析 周数据
     */
    app.get('/api/oas/trend-week', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.indicatortrendWeekData);
    /**
     * 分析系统 指标分析 月数据
     */
    app.get('/api/oas/trend-month', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.indicatortrendMonthData);
    /**
     * 分析系统 五力模型 日数据
     */
    app.get('/api/oas/5li-day', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.fiveForceDayData);
    /**
     * 分析系统 五力模型 周数据
     */
    app.get('/api/oas/5li-week', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.fiveForceWeekData);
    /**
     * 分析系统 五力模型 月数据
     */
    app.get('/api/oas/5li-month', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.fiveForceMonthData);
    /**
     * 分析系统 1日节点留存数据
     */
    app.get('/api/oas/steplost-day', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.stepLostOneDay);
    /**
     * 分析系统 2日节点留存数据
     */
    app.get('/api/oas/steplost-2day', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.stepLostTwoDay);
    /**
     * 分析系统 7日节点留存数据
     */
    app.get('/api/oas/steplost-7day', sessionMiddleware.support, sessionMiddleware.checkUser, accessMiddleware.checkAccess, OasAPI.stepLostSevenDay);

    /**
     * SDK自动化打包相关接口
     * 主要进行请求转发
     */
    /**
     *  SDK自动化打包 - 查看游戏列表接口
     */
    app.get('/pocketgames/web/game/list', SDKAPI.getGameList);
    /**
     * SDK自动化打包 - 查看游戏详情
     */
    app.get('/pocketgames/web/game/find', SDKAPI.getGameDetail);

    /**
     * SDK自动化打包 - 添加游戏信息
     */
    app.post('/pocketgames/web/game/add', multipartyMiddleware, SDKAPI.addGame);

    /**
     * SDK自动化打包 - 修改游戏信息
     */
    app.post('/pocketgames/web/game/edit', multipartyMiddleware, SDKAPI.updateGame);

    /**
     *  SDK自动化打包 -查看同步数据
     */
    app.get('/pocketgames/web/game/refresh', SDKAPI.refreshGame);
    /**
     * SDK自动化打包 - 签名列表
     */
    app.get('/pocketgames/web/cert/list', SDKAPI.getCertList);
    /**
     * SDK自动化打包 - 删除签名
     */
    app.get('/pocketgames/web/cert/delete', SDKAPI.delCert);
    /**
     * SDK自动化打包 - 添加签名
     */
    app.post('/pocketgames/web/cert/add', multipartyMiddleware, SDKAPI.addCert);

    /**
     * SDK自动化打包 - 查看渠道
     */
    app.get('/pocketgames/web/channel/list', SDKAPI.getChannelList);

    /**
     *SDK自动化打包 - 查看游戏当前渠道
     */
    app.get('/pocketgames/web/packageConfig/list', SDKAPI.getGameChannelList);

    /**
     * SDK自动化打包 - 添加渠道
     */
    app.post('/pocketgames/web/packageConfig/add', multipartyMiddleware, SDKAPI.addChannel);
    /**
     * SDK自动化打包 - 获取渠道配置参数信息
     */
    app.get('/pocketgames/web/packageConfigDetail/show', SDKAPI.getChannelConfigs);
    /**
     * SDK自动化打包 - 修改渠道包名、参数配置
     */
    app.post('/pocketgames/web/packageConfigDetail/save', SDKAPI.updateChannelConfig);

    /**
     *SDK自动化打包 - 获取渠道回调配置信息
     */
    app.get('/pocketgames/web/channelConfig/callback/detail', SDKAPI.callbackConfigs);

    /**
     * SDK自动化打包 - 添加回调地址
     */
    app.post('/pocketgames/web/channelConfig/callback/add', SDKAPI.addCallbackConfig);

    /**
     * SDK自动化打包-闪屏接口
     */
    app.get('/pocketgames/web/packageConfigDetail/splash/show', SDKAPI.getSplashConfigs);

    /**
     * SDK自动化打包-闪屏上传接口
     */
    app.post('/pocketgames/web/packageConfigDetail/splash/save', multipartyMiddleware, SDKAPI.addSplashConfig);

    /**
     * SDK自动化打包-获取游戏图标配置
     */
    app.get('/pocketgames/web/packageConfigDetail/icon/show', SDKAPI.getIconConfigs);

    /**
     * SDK自动化打包-保存游戏图标配置
     */
    app.post('/pocketgames/web/packageConfigDetail/icon/save', multipartyMiddleware, SDKAPI.addIconConfig);

    /**
     * SDK自动化打包-证书详情接口
     */
    app.get('/pocketgames/web/packageConfigDetail/cert/show', SDKAPI.getCertConfigs);

    /**
     * SDK自动化打包-证书添加接口
     */
    app.post('/pocketgames/web/packageConfigDetail/cert/save', SDKAPI.addCertChannel);

    /**
     * SDK自动化打包 -同步渠道接口
     */
    app.get('/pocketgames/web/packageConfig/refresh',SDKAPI.refreshPackageConfig);

    /**
     * SDK自动化打包 -同步渠道配置详情接口
     */
    app.get('/pocketgames/web/packageConfigDetail/refresh',SDKAPI.refreshPackageConfigDetail);

    /**
     * SDK自动化打包 - 查看版本
     */
    app.get('/pocketgames/web/gameVersion/list', SDKAPI.getVersionList);

    /**
     * SDK自动化打包 - 添加版本
     */
    app.post('/pocketgames/web/gameVersion/add', multipartyMiddleware, SDKAPI.addVersion);

    /**
     * SDK自动化打包 - 修改版本
     */
    app.post('/pocketgames/web/gameVersion/edit', multipartyMiddleware, SDKAPI.updateVersion);


    /**
     * SDK自动化打包 -获取打包列表
     */
    app.get('/pocketgames/web/gamepackage/list', multipartyMiddleware, SDKAPI.getPackageList);

    /**
     * SDK自动化打包 -打包添加接口
     */
    app.post('/pocketgames/web/gamepackage/add', SDKAPI.addPackage);

    /**
     * SDK自动化打包 -获取打包状态
     */
    app.get('/pocketgames/web/gamepackage/find', SDKAPI.getPackageStatus);

    /**
     * SDK自动化打包 -获取历史记录列表
     */
    app.get('/pocketgames/web/gamepackage/history', SDKAPI.getHistoryList);

    /**
     * SDK自动化打包 -SDK资源包上传接口
     */
    app.post('/pocketgames/web/channel/upload', multipartyMiddleware, SDKAPI.addPocketConfig);

    /**
     *  SDK自动化打包 -渠道包版本列表
     */
    app.get('/pocketgames/web/package/version/list', SDKAPI.getChannelPackageList);

    /**
     * SDK自动化打包 -渠道包版本添加保存
     */
    app.post('/pocketgames/web/package/version/save', SDKAPI.addPackageVersion);

    /**
     * 获取地区
     */
    app.get('/api/reportmap/areas',ReportMapAPI.getAreas);
    /**
     * 获取地区下面所有的国家信息
     */
    app.get('/api/reportmap/countrys',ReportMapAPI.getAreaCountrys);
    /**
     * 获取国家下面所有的游戏信息
     */
    app.get('/api/reportmap/apps',ReportMapAPI.getCountryApps);
    /**
     * 获取报表数据
     */
    app.get('/api/reportmap/data',ReportMapAPI.getData);
    app.get('*', function (req, res) {
        res.end(404);
    });
};
