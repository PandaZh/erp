/**
 * Created by xiaoyi on 2015/6/30.
 */
var addSessionSupport   = require('../cookie/addSessionSupport');
var SessionManager = require('../cookie/session').SessionManager;
var resDataUtil = require('../utils/resDataUtil');

exports.support = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    addSessionSupport(req, res, next);
};

exports.checkUser = function(req, res, next){
    var session = req.session;
    console.log("session.get('username')=" + session.get('username'));
    if (!SessionManager.isTimeout(session) && session.get('username') ) {
        next();
    }else{
        res.writeHead(403, "TIME OUT | NO LOGIN");
        res.end(resDataUtil.accessError('relogin','session超时或者验证失败，请重新登录！'));
    }
}

exports.checkAdmin = function(req, res, next){
    var session = req.session;
    if (!SessionManager.isTimeout(session) && session.get('username') && session.get('admin') === "true") {
        next();
    }else{
        res.writeHead(403, "TIME OUT | NO LOGIN");
        res.end(resDataUtil.accessError('relogin','session超时或者验证失败，请重新登录！'));
    }
}