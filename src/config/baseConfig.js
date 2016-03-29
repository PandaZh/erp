/**
 * Created by xiaoyi on 2015/4/3.
 */

//var app = require('../../app');

var BaseConfig = {
    db:{
        poolConfig : {
            min :2,
            max :3,
            log :false
        },
        connectionConfig:{
            userName    :"u_oas",
            password    :"123@asdf",
            server      :"119.147.247.34"
        },
        dbName:'db_databank',
        testDbName:'db_databank_test'
    },
    access_level:{
        NO_PASS : 0,
        NORMAL :1,
        ADMIN:2
    },
    getRunningDb: function(){
        if (app.get('env') === 'production'){
            return this.db.dbName
        }else{ //development
            return this.db.testDbName
        }
    }
}
module.exports = BaseConfig;

