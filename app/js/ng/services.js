'use strict';

/* Services */

// Define your services here if necessary
var appServices = angular.module('app.services', []);

/**
 * Override default angular exception handler to log and alert info if debug mode
 */
appServices.factory('$exceptionHandler', function ($log) {
    return function (exception, cause) {
        var errors = JSON.parse(localStorage.getItem('sing-angular-errors')) || {};
        errors[new Date().getTime()] = arguments;
        localStorage.setItem('sing-angular-errors', JSON.stringify(errors));
        app.debug && $log.error.apply($log, arguments);
        app.debug && alert('check errors');
    };
});

/**
 * 用户权限数据
 */
appServices.factory('$access', function(){
    var service ={
        Access:{
            menus: [
                {
                    menu_id:1,
                    menu_name:'主页',
                    menu_url:'main',
                    menu_icon:'icon icon-home',
                    children:[]
                },
                {
                    menu_id:22,
                    menu_name:'highcharts测试',
                    menu_url:'highchartsTest',
                    menu_icon:'icon icon-home',
                    children:[]
                },
                {
                    menu_id:2,
                    menu_name:'数据录入',
                    menu_url:'insert',
                    menu_icon:'icon icon-edit',
                    children:[
                        {
                            menu_id:3,
                            menu_name:'投放单价',
                            menu_url:'adPrice',
                            menu_icon:'glyphicon glyphicon-usd'
                        },
                        {
                            menu_id:4,
                            menu_name:'APP录入',
                            menu_url:'appInfo',
                            menu_icon:'icon icon-pencil'
                        },
                        {
                            menu_id:5,
                            menu_name:'配置国家',
                            menu_url:'country',
                            menu_icon:'icon icon-globe'
                        }
                    ]
                },
                {
                    menu_id:3,
                    menu_name:'推广渠道',
                    menu_url:'channel',
                    menu_icon:'icon icon-facebook-sign',
                    children:[{
                        menu_id:3,
                        menu_name:'渠道数据',
                        menu_url:'detail',
                        menu_icon:'icon  icon-bookmark-empty'
                    }]
                }
            ],
            games:[
                {
                    game_id:10009, game_name:'全民主公', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:10002, game_name:'越南超级英雄', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:1004, game_name:'越南攻城掠地', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:1006, game_name:'泰国攻城掠地', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:1022, game_name:'暗黑战神', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:10005, game_name:'国际版LOL', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:1020, game_name:'越南LOL', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:1018, game_name:'圣火英雄传', game_icon:'', game_currency:'USD'
                },
                {
                    game_id:10013, game_name:'圣火英雄传2', game_icon:'', game_currency:'USD'
                }
                //,
                //{
                //    game_id:1020, game_name:'天天LOL', game_icon:'', game_currency:'USD',
                //    channels:[
                //        {
                //            channel_id:1,channel_name:'FB'
                //        },
                //        {
                //            channel_id:2,channel_name:'Mwork'
                //        }
                //    ],
                //    os:[
                //        {
                //            id:1, name:'ios'
                //        },
                //        {
                //            id:2, name:'android'
                //        }
                //    ]
                //}
            ]
        },
        setAccess: function(Access){
            service.Access = Access;
        },
        getAccess: function(){
            return service.Access;
        }
    }
    return service;
});

/**
 * 共享数据
 */
appServices.factory('$SharedData', function(){
    var service ={
        sharedData:{},
        setShareData: function(data){
            service.sharedData = data;
        },
        getShareData: function(){
            return service.sharedData;
        }
    }
    return service;
});

/**
 * lazy加载页面js文件
 */
appServices.factory('scriptLoader', ['$q', '$timeout', function($q, $timeout) {
    var processedScripts = [];
    return {
        loadScriptTagsFromData: function(data) {
            var deferred = $q.defer();
            var $contents = $($.parseHTML(data, document, true)),
                $scripts = $contents.filter('script[data-src][type="text/javascript-lazy"]').add($contents.find('script[data-src][type="text/javascript-lazy"]')),
                scriptLoader = this;

            scriptLoader.loadScripts($scripts.map(function(){ return $(this).attr('data-src')}).get())
                .then(function(){
                    deferred.resolve(data);
                });

            return deferred.promise;
        },

        loadScripts: function(scripts) {
            var previousDefer = $q.defer();
            previousDefer.resolve();
            scripts.forEach(function(script){
                if (processedScripts[script]){
                    if (processedScripts[script].processing){
                        previousDefer = processedScripts[script];
                    }
                    return
                }

                var scriptTag = document.createElement('script'),
                    $scriptTag = $(scriptTag),
                    defer = $q.defer();
                scriptTag.src = script;
                defer.processing = true;

                $scriptTag.load(function(){
                    $timeout(function(){
                        defer.resolve();
                        defer.processing = false;
                        Pace.restart();
                    })
                });

                previousDefer.promise.then(function(){
                    document.body.appendChild(scriptTag);
                });

                processedScripts[script] = previousDefer = defer;
            });

            return previousDefer.promise;
        }
    }
}]);

/**
 * APPS列表查询 添加
 */
appServices.factory('appsInfoService', ['$http', '$rootScope',function($http, $rootScope){
    var service ={
        apps:[],
        addApp: function(app){
            service.apps.push(app);
        },
        delApp: function(app){
            for(var i = 0; i < service.apps.length; i++){
                if(service.apps[i].id == app.id){
                    service.apps.splice(i,1);
                    service.botadcastEvent();
                    break;
                }
            }
        },
        updateApp: function(app){
            for(var i = 0; i < service.apps.length; i++){
                if(service.apps[i].id == app.id){
                    service.apps.splice(i, 1, app);
                    service.botadcastEvent();
                    break;
                }
            }
        },
        getApps: function(){
            $http.get('api/app').success(function(data){
                service.apps = data.result;
                service.botadcastEvent();
            });
        },
        botadcastEvent: function(){
            $rootScope.$broadcast('apps.update');
        }
    }
    return service;
}]);

/**
 * APP修改、删除
 */
appServices.factory('appInfoService', ['$http', '$rootScope', '$q',function($http, $rootScope, $q){
    var service ={
        app:{},
        addApp: function(app){
            var deferred = $q.defer();
            $http({method:'post',url:'api/app/add',params: app})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        delApp: function(app){
            var deferred = $q.defer();
            $http({method:'post',url:'api/app/delete',params: {id:app.id}})
                .success(function(data){
                   deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        updateApp: function(app){
            var deferred = $q.defer();
            $http({method:'post',url:'api/app/update',params: app})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        botadcastEvent: function(){
            $rootScope.$broadcast('app.update');
        }
    }
    return service;
}]);

/**
 * 国家状态查询、修改
 */
appServices.factory('countryListService', ['$http', '$rootScope', '$q',function($http, $rootScope, $q){
    var service ={
        countrys:[],
        query: function(){
            var deferred = $q.defer();
            $http({method:'get',url:'api/country'})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        queryUseCountry: function(){
            var deferred = $q.defer();
            $http({method:'get',url:'api/country/use'})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        updateCountrys: function(data){
            var deferred = $q.defer();
            $http({method:'post',url:'api/country/update',params: data})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        updateList: function(countrys){
            service.countrys = countrys;
            service.botadcastEvent();
        },
        botadcastEvent: function(){
            $rootScope.$broadcast('countryList.update');
        }
    }
    return service;
}]);
/**
 * 渠道详情
 */
appServices.factory('channelService', ['$http', '$rootScope', '$q',function($http, $rootScope, $q){
    var service ={
        query: function(arg){
            var deferred = $q.defer();
            $http({method:'get',url:'api/channel/detail', params:arg})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        querySonChannel : function(arg){
            var deferred = $q.defer();
            $http({method:'get',url:'api/channel/son', params:arg})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        }
    }
    return service;
}]);

/**
 * 渠道价格配置
 */
appServices.factory('channelPriceSettingService',['$q','$http','$rootScope', function($q,$http, $rootScope){
    var service ={
        channelPrices:[],
        query: function(arg){
            var deferred = $q.defer();
            $http({method:'get',url:'api/channelPrice',params: arg})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        addFixedCost: function(obj){
            var deferred = $q.defer();
            $http({method:'post',url:'api/channelPrice/cfc/add',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        updateFixedCost: function(obj){
            var deferred = $q.defer();
            $http({method:'post',url:'api/channelPrice/cfc/update',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        delFixedCost: function(obj){
            var deferred = $q.defer();
            var parameters = {id: obj.id};
            $http({method:'post',url:'api/channelPrice/cfc/delete',params: parameters})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        addFixedPrice: function(obj){
            var deferred = $q.defer();
            $http({method:'post',url:'api/channelPrice/cfp/add',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        updateFixedPrice: function(obj){
            var deferred = $q.defer();
            $http({method:'post',url:'api/channelPrice/cfp/update',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        delFixedPrice: function(obj){
            var deferred = $q.defer();
            var parameters = {id: obj.id};
            $http({method:'post',url:'api/channelPrice/cfp/delete',params: parameters})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        addFixedCountryPrice: function(obj){
            var deferred = $q.defer();
            $http({method:'post',url:'api/channelPrice/cfcp/add',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        updateFixedCountryPrice: function(obj){
            var deferred = $q.defer();
            $http({method:'post',url:'api/channelPrice/cfcp/update',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        delFixedCountryPrice: function(obj){
            var deferred = $q.defer();
            $http({method:'post',url:'api/channelPrice/cfcp/delete',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        queryFixedCountryPrice: function(obj){
            var deferred = $q.defer();
            $http({method:'get',url:' api/channelPrice/cfcp/query',params: obj})
                .success(function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        },
        addToList: function(obj){
            service.channelPrices.push(obj);
            service.botadcastEvent();
        },
        updateList: function(obj){
            for(var i = 0; i < service.channelPrices.length; i++){
                if(service.channelPrices[i].id == data.id){
                    service.channelPrices.splice(i, 1, obj);
                    service.botadcastEvent();
                    break;
                }
            }
            service.botadcastEvent();
        },
        delFromList: function(data){
            for(var i = 0; i < service.channelPrices.length; i++){
                if(service.channelPrices[i].id == data.id){
                    service.channelPrices.splice(i, 1);
                    service.botadcastEvent();
                    break;
                }
            }
        },
        botadcastEvent: function(){
            $rootScope.$broadcast('channelPriceList.update');
        }
    };

    return service;

}]);

/**
 * 用户储存页面调整时的参数信息
 */
appServices.factory('changePageService', [ '$q','$location',function($q,$location) {
    var service = {
        arg:{media_source:'glispa_int',app_id:1004, app_name:'越南攻城掠地', os: 2},
        getArg : function() {
            return service.arg;
        },
        setArg : function(arg) {
            service.arg = arg;
        },
        jumpToURL: function(url, arg){
            arg = arg ? arg :{};
            service.setArg(arg);
            $location.path(url);
            //$state.go(url,arg, {reload: true});
        }
    }
    return service;
}]);

/**
 * HTTP拦截器，判断用户权限及是否登录
 */
appServices.factory('httpInterceptor', [ '$q', '$injector', '$rootScope',function($q, $injector, $rootScope) {
    var httpInterceptor = {
        'responseError' : function(response) {
            if (response.status == 401) {
                var state = $rootScope.$state.current.name;
                $rootScope.stateBeforLogin = state;
                $rootScope.$state.go("login");
                return $q.reject(response);
            } else if (response.status === 404) {
                alert("404!");
                return $q.reject(response);
            }
        },
        'response' : function(response) {
            return response;
        }
    }
    return httpInterceptor;
}]);