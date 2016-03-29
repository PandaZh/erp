/**
 * Created by xiaoyi on 2016/2/23.
 */
var when            = require('when');
var log             = require('../utils/logUtil');
var dbUtil          = require('../utils/dbPoolUtil');
var resDataUtil     = require('../utils/resDataUtil');
var url             = require('url');


function getAreas(req, res){
    var areas = [{
        area_code:'ASAN',
        area_name:'东南亚'
    },{
        area_code:'SM',
        area_name:'新马地区'
    },{
        area_code:'OTHER',
        area_name:'其他地区'
    }];

    res.send(areas);
}

function getAreaCountrys(req, res){
    var args = req.query;
    var areaCode = args.area_code;
    if(!areaCode){
        return res.send('请添加参数：area_code');
    }

    var contries = [{
        country_code:'VN',
        country_name:'越南'
    },{
        country_code:'TH',
        country_name:'泰国'
    },{
        country_code:'ASAN-OTHER',
        country_name:'其他'
    }];
    res.send(contries);
}
function getCountryApps(req, res){
    var args = req.query;
    var countryCode = args.country_code;
    if(!countryCode){
        return res.send('请添加参数：country_code');
    }

    var apps = [{
        app_id:10002,
        app_name:'越南超级英雄'
    },{
        app_id:10020,
        app_name:'越南口袋联盟'
    }]
    res.send(apps);
}

function getDate(req, res){
    var args = req.query;
    var areaCode = args.area_code;
    var countryCode = args.country_code;
    var appId = args.appId;
    var os = args.os; // 0:ios 1:android 0,1: IOS&android
    var count_date = args.count_date; // 日期

    var data = [{
        countDate:'2015-02-02',
        os:1,
        installs:1000,
        regs:900,
        roles:800,
        cost:188.88,
        newServerRoles:300,
        liucun:300,
        liucun3:200,
        liucun7:100
    },{
        countDate:'2015-02-02',
        os:1,
        installs:1000,
        regs:900,
        roles:800,
        cost:188.88,
        newServerRoles:300,
        liucun:300,
        liucun3:200,
        liucun7:100
    }]

    res.send(data);


}

var API ={
    getAreas:getAreas,
    getAreaCountrys:getAreaCountrys,
    getCountryApps:getCountryApps,
    getData: getDate
}
module.exports = API;