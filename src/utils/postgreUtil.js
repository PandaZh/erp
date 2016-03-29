/**
 * Created by xiaoyi on 2015/8/4.
 */

var when        = require('when');
var pg          = require('pg');


/**
 * postgre https://github.com/brianc/node-postgres
 * @type {string}
 */
// 测试环境帐号
var conString = "postgres://gp_dev_user:Chdev7GR4pg56@113.107.167.25/db_game_data";
//var conString = "postgres://gp_pg_user:Ch7GR4pg56@119.147.247.27/db_game_data";
 /* 直连方式
 * @type {exports.Client}
 */
//var client = new pg.Client(conString);
//client.connect(function(err) {
//    if(err) {
//        return console.error('could not connect to postgres', err);
//    }
//    client.query("SELECT * from sc_game_dw_data.fn_5min_online(1, 1 , '2015-03-09','2015-03-10','2015-03-11')", function(err, result) {
//        if(err) {
//            return console.error('error running query', err);
//        }
//        console.log(result.rows);
//        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
//        client.end();
//    });
//});

/**
 * @连接池方式
 */
function query(sql, params) {
    var deffered = when.defer();
    var obj ={
        rowCount:0,
        result:[]
    }
    pg.connect(conString, function (err, client, done) {
        if (err) {
            //return console.error('error fetching client from pool', err);
            deffered.reject('error fetching client from pool' + err);
            return;
        }
        client.query(sql, params, function (err, result) {
            //call `done()` to release the client back to the pool
            done();
            if(err){
                console.dir(err);
                deffered.reject(err);
            }else{
                console.log(result);
                deffered.resolve({rowCount:result.rowCount, result:result.rows});
            }
        });
    });
    return deffered.promise;
}

//query("SELECT * from sc_game_dw_data.fn_5min_online3($1,$2,$3,$4,$5)",[1, 1 , '2015-03-09','2015-03-10','2015-03-11'],function(err,result){
//    if(err) {
//        return console.error('error running query', err);
//    }
//    console.log(result.rows);
//})
var pgUtil = {
    query: query
}
module.exports = pgUtil;