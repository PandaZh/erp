/**
 * Created by xiaoyi on 2015/8/5.
 */
var when = require('when');
var log = require('../utils/logUtil');
var dbUtil = require('../utils/dbPoolUtil');
var resDataUtil = require('../utils/resDataUtil');
var url = require('url');
var http = require('http');
var crypto = require('crypto');
var session = require("../cookie/session");
var sessionManager = session.SessionManager;
// 改为：crypto.createHash('md5').update(data).digest('hex')
//var md5 = crypto.createHash('md5'); // 这样声明，第一次MD5OK，后面都会报错 Caught exception: TypeError: HashUpdate fail
/**
 * 校验用户
 * @param req
 * @param res
 */
function checkUser(req, res) {
    var args = req.query;
    var userName = args.username;
    var pwd = args.password;
    if (!userName || !pwd) {
        res.end(resDataUtil.error('failed', '用户名或者密码不合法！'))
        return
    }
    var options = {
        hostname: '119.147.247.34',
        port: 6664,
        path: '/query?type=username&id=xiaoyi',
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var request = http.get(options, function (response) {
        response.on('data', function (chunk) {
            var result = JSON.parse(chunk);
            if (result['user_password'] === crypto.createHash('md5').update(pwd).digest('hex')) {
                sessionManager.get(req.sessionId).set('username', userName);
                res.end(resDataUtil.success('login success'));
            } else {
                res.end(resDataUtil.error('failed', '密码错误'))
            }
        });
    });
    request.on('error', function (e) {
        res.end(resDataUtil.error('failed', 'problem with request: ' + e.message))
    });
}



/**
 * 获取用户权限
 * @param req
 * @param res
 * @returns {*}
 */
function getUserAccess(req, res) {

    var args = req.query;
    var userName = args.username;
    var pwd = args.password;
    if (!userName || !pwd) {
        res.end(resDataUtil.error('failed', '用户名或者密码不合法！'))
        return
    }
    var options = {
        hostname: '119.147.247.34',
        //hostname:'10.10.15.66',
        port: 8600,
        path: '/access/user/login?username='+userName+'&pwd=' + crypto.createHash('md5').update(pwd).digest('hex'),
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var request = http.get(options, function (response) {

        var data = "";
        response.on('data', function (chunk) {
            data += chunk
        });
        response.on('end', function () {
            var json = JSON.parse(data);
            if(json.code ==0){
                res.end(resDataUtil.error('failed', '用户名或者密码错误！'))
            }else{
                if(json.menus.length <=0){
                    res.end(resDataUtil.error('failed', 'sorry，当前帐号没有任何菜单权限！'))
                    return;
                }
                var menus = [];
                for(var i = 0; i < json.menus.length; i++){
                    var temp  = json.menus[i];
                    console.log(temp.menu_id);
                    if(temp.menu_id == 4){
                        menus.push(temp);
                    }
                }
                json.menus = menus;
                req.session.set('username', userName)
                req.session.set('menuAccess', getAccessMenuIds(json));
                res.end(resDataUtil.success({access:json.result,menus:json.menus}));
            }
        });
    });
    request.on('error', function (e) {
        res.end(resDataUtil.error('failed', 'problem with request: ' + e.message))
    });
    request.end();
}

function getAccessAgentIds(json){
    var gamesAccess = json.result;
    var arr = [];
    for(var i = 0;i<gamesAccess.length; i++){
        arr.push(gamesAccess.children.agent);
    }
}

function getAccessMenuIds(json){
    var menuIDs = [];
    function getId(menus){
        if(menus.children){
            for(var i = 0; i < menus.children.length; i++){
                var temp = menus.children[i];
                if(temp.menu_url){
                    menuIDs.push(temp.menu_id);
                }
                getId(temp);
            }
        }
    }
    for(var i =0; i < json.menus.length; i++){
        var temp = json.menus[i];
        if(temp.menu_url){
            menuIDs.push(temp.menu_id);
        }
        getId(temp);
    }
    return menuIDs.join(',');
}


var API = {
    checkUser: checkUser,
    getUserAccess: getUserAccess
}
module.exports = API;