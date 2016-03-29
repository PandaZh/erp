'use strict';

var appControllers = angular.module('app.controllers', []);

//settings and state
var app = {
    name: 'databank',
    title: 'databank - Dashboard',
    version: '1.0.0',
    debug: true
};


appControllers.controller('BankAppController', ['$scope', '$localStorage',function ($scope, $localStorage){
    $scope.app = app;
    if (angular.isDefined($localStorage.state)){
        $scope.app.state = $localStorage.state;
    } else {
        $localStorage.state = $scope.app.state;
    }

    $scope.print = function(){
        window.print();
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $scope.loginPage = toState.name == 'login';
        $scope.errorPage = toState.name == 'error';
        //$(document).trigger('sn:loaded', [event, toState, toParams, fromState, fromParams]);
    })
}]);

/**
 * 左侧菜单controller
 */
appControllers.controller('sidebarController', ['$scope', '$localStorage','$http','$access',function ($scope, $localStorage, $http,$access){
    var menus = $access.getAccess().menus;
    $scope.menus = menus;
}]);

/**
 * IOS Android平台按钮切换
 */
appControllers.controller('osChoseController', ['$scope',function ($scope){
    $scope.choseIOS = function(){
        $scope.choseRow.os = 1;
        $scope.isIOS = true;
        $scope.choseOS =1;
    }

    $scope.choseAndroid = function(){
        $scope.choseRow.os = 2;
        $scope.isIOS = false;
        $scope.choseOS =2;
    }

}]);


/**
 * insert-appInfo 获取、添加app信息
 */
appControllers.controller('appInfoController',['$scope','$location', '$localStorage', '$SharedData','$modal', '$http', 'appsInfoService', 'appInfoService',function ($scope, $location, $localStorage, $SharedData,$modal, $http, appsInfo, appInfo){

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.$on('addAlert',function(event, alert){
        $scope.alerts.push(alert);
    })
    $scope.showEdit = false;
    $scope.isIOS = true;
    var cur_os = 1;
    $scope.$on('apps.update', function(){
        $scope.tableData = appsInfo.apps;
    });
    appsInfo.getApps();
    $scope.tableData = appsInfo.apps;

    $scope.choseIOS = function(){
        $scope.isIOS = true;
        cur_os =1;
    }

    $scope.choseAndroid = function(){
        $scope.isIOS = false;
        cur_os =2;
    }

    $scope.addApp = function(){
       var app = $scope.addAppInfo;
        if(app.app_id && app.app_name && app.package_name){
            app.choseOS = cur_os;
            var promise = appInfo.addApp(app);
            promise.then(function(data){
                if(data.code == 0){
                    $scope.alerts.push( {type: 'success', msg: '添加成功'});
                    $scope.addAppInfo = {};
                    app.id = data.result[0].id;
                    app.os = app.choseOS;
                    appsInfo.addApp(app);
                }else{
                    alert(data.msg);
                }
            });
        }else{
            $scope.alerts.push( {type: 'danger', msg: '录入信息缺失，请检查后添加！'});
        }
    }
    $scope.openUpdateModal =function(size, row){
        console.log(row);
        var modalInstance = $modal.open({
            templateUrl:'editAppContent.html',
            controller:'appInfoModalController',
            size: size,
            resolve: {
                row: function () {
                    return row;
                },
                type:function(){
                    return 'update';
                }
            }
        });
        modalInstance.result.then(function (newApp) {
            var promise  = appInfo.updateApp(newApp);
            promise.then(function(data){
                if(data.code == 0){
                    //appsInfo.updateApp(newApp); // 刷新列表
                    $scope.alerts.push({type: 'success', msg: '修改成功！'});
                }else{
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });

    }

    $scope.openDelModal =function(size, row){
        var modalInstance = $modal.open({
            templateUrl:'editAppContent.html',
            controller:'appInfoModalController',
            size: size,
            resolve: {
                row: function () {
                    return row;
                },
                type:function(){
                    return 'delete';
                }
            }
        });
        modalInstance.result.then(function (app) {
            var promise  = appInfo.delApp(app);
            promise.then(function(data){
                if(data.code == 0){
                    appsInfo.delApp(app);
                    $scope.alerts.push({type: 'success', msg: '删除成功！'});
                }else{
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });
    }
}]);

/**
 * insert-appInfo 修改/删除APP信息弹出框
 */
appControllers.controller('appInfoModalController', ['$scope','$modalInstance','row', 'type',function ($scope, $modalInstance, row, type){
    $scope.isIOS = false;
    $scope.hideIos = false;
    $scope.hideAndroid = false;
    if(row.os == 1){
        $scope.isIOS = true;
    }
    $scope.choseRow = row;
    if(type =='update'){
        $scope.title='修改应用信息'
        $scope.Operation = '修改';
    }else if(type =='delete'){
        $scope.title='确定删除应用信息？'
        $scope.Operation = '删除';
        $scope.readonly = true;
        if($scope.isIOS){
            $scope.hideIos = false;
            $scope.hideAndroid = true;
        }else{
            $scope.hideIos = true;
            $scope.hideAndroid = false;
        }
    }
    $scope.ok = function () {
        $modalInstance.close($scope.choseRow);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);


/**
 * 渠道详情页
 */
appControllers.controller('channelDetailPageController', ['$scope','$location', '$localStorage', '$access','channelService','changePageService','$modal',function ($scope, $location, $localStorage, $access, channelService,changePageService,$modal){
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    // 初始化条件值
    var cur_game_id = null;
    var cur_game_name =null;
    var cur_os = 1;

    var isAlreadSelect = false;
    for(var i = 0; i < $access.Access.games.length; i++){
        var temp = $access.Access.games[i];
        if(temp.isSelected == true){
            isAlreadSelect = true;
            cur_game_id = temp.game_id;
            cur_game_name = temp.game_name;
            break;
        }else{
            $access.Access.games[i].isSelected = false
        }
    };
    if(!isAlreadSelect){
        $access.Access.games[0].isSelected = true;
        cur_game_id = $access.Access.games[0].game_id;
        cur_game_name = $access.Access.games[0].game_name;
        $scope.isSelectIOS = true;
    }

    if($scope.isSelectIOS){
        cur_os = 1;
    }else{
        $scope.isSelectIOS = false;
        cur_os = 2;
    }

    $scope.radioModel =  $scope.radioModel ?  $scope.radioModel : 1;
    $scope.checkModel = {
        1: true,
        2: false,
        3: false
    };
    var now = new Date();
    if(now.getHours() > 14){
        $scope.end_date = $scope.end_date ? $scope.end_date : new Date(now.setDate(now.getDate() -1 )).Format("yyyy-MM-dd");
    }else{
        $scope.end_date = $scope.end_date ? $scope.end_date : new Date(now.setDate(now.getDate() -2 )).Format("yyyy-MM-dd");
    }
    $scope.begin_date =  $scope.end_date ;//? $scope.begin_date : new Date(new Date().setDate(new Date().getDate() -1 )).Format("yyyy-MM-dd");

    $scope.beginDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.beginDateOpened = true;
        $scope.endDateOpened = false;
    };
    $scope.endDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endDateOpened = true;
        $scope.beginDateOpened = false;
    };

    $scope.games = $access.Access.games;
    $scope.switchGame = function(game){
        if( game.isSelected &&game.isSelected == true){
            return;
        }
        for(var i = 0; i <  $scope.games.length; i++){
            var _game = $scope.games[i];
            if(_game.isSelected && _game.isSelected == true){
                _game.isSelected = false;
                break;
            }
        }
        game.isSelected = true;
        cur_game_id = game.game_id;
        cur_game_name = game.game_name;
    }

    $scope.setChannelPrice = function(row){
        var obj = {
            app_id : cur_game_id,
            media_source:row.td_name,
            os :cur_os,
            app_name: cur_game_name
        }
        changePageService.jumpToURL('/app/insert/adPrice',obj);
    }
    $scope.switchOS = function(type){
        if(type ==1){
            $scope.isSelectIOS = true;
        }else if(type ==2){
            $scope.isSelectIOS = false;
        }
        cur_os = type;
    }

    $scope.showSonChannel = function(row){
        var obj = {
            app_id : cur_game_id,
            media_source:row.td_name,
            begin_date:new Date($scope.begin_date).Format("yyyy-MM-dd"),
            end_date: new Date($scope.end_date).Format("yyyy-MM-dd")
        }
        var promise = channelService.querySonChannel(obj);
        promise.then(function (data) {
            if(data.code ==0){
                if(data.result.length<=0){
                    $scope.alerts.push({type: 'danger', msg: '当前条件没有数据!请选择其他条件'});
                }else{
                    showModal( data.result, obj.media_source);
                }
            }else{
                $scope.alerts.push({type: 'danger', msg: data.msg});
            }

        });
    }
    function showModal(data,media_source){
         $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
             resolve: {
                 data: function () {
                     var obj = {
                         media_source: media_source,
                         items: data
                     }
                     return obj;
                 }
             }
        });
    }

    $scope.query = function(){
        var obj ={};
        //obj.begin_date = $scope.begin_date;
        //obj.end_date = $scope.end_date;
        obj.begin_date = new Date($scope.begin_date).Format("yyyy-MM-dd");
        obj.end_date =  new Date($scope.end_date).Format("yyyy-MM-dd");
        obj.app_id = cur_game_id;
        obj.os = cur_os;
        obj.type = $scope.radioModel
        var promise = channelService.query(obj);
        promise.then(function (data) {
            if(data.code ==0){
                if(data.result.length<=0){
                    $scope.alerts.push({type: 'danger', msg: '当前条件没有数据!请选择其他条件'});
                }else{
                    $scope.tableData = data.result;
                }
            }else{
                $scope.alerts.push({type: 'danger', msg: data.msg});
            }

        });
    }

    $scope.query();
}]);

/**
 * 录入-投放价格录入Controller
 */
appControllers.controller('InsertAdPriceController', ['$scope','$stateParams','$modal', '$localStorage','$SharedData', 'channelPriceSettingService','changePageService','countryListService',function ($scope, $stateParams, $modal, $localStorage ,$SharedData, channelPriceSettingService, changePageService, countryListService){
    //alert($SharedData.sharedData);
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.$on('addAlert',function(event, alert){
        $scope.alerts.push(alert);
    })

    $scope.$on('channelPriceList.update', function(){
        $scope.tableData = channelPriceSettingService.channelPrices;
    });
    $scope.choseChannelInfo = changePageService.getArg();
    //alert($stateParams);
    //$scope.choseChannelInfo ={
    //    app_id: $stateParams.app_id,
    //    app_name: $stateParams.app_name,
    //    os : $stateParams.os,
    //    media_source : $stateParams.media_source
    //}
    $scope.tableData =[];
    var promise = channelPriceSettingService.query($scope.choseChannelInfo);
    promise.then(function(data){
        channelPriceSettingService.channelPrices = data.result;
        $scope.tableData = data.result;
    });


    $scope.openAddCFPModal = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'channelPriceModal.html',
            controller: 'InsertAdPriceModalController',
            size: size,
            resolve: {
                row: function () {
                    return {};
                },
                insertDataType: function () {
                    return 'cfp';
                },
                operationType: function(){
                    return 'add';
                }
            }
        });
        modalInstance.result.then(function (modalData) {
            modalData.begin_date = new Date(modalData.begin_date).Format("yyyy-MM-dd");
            modalData.end_date = new Date(modalData.end_date).Format("yyyy-MM-dd");
            var newData = angular.extend( modalData, $scope.choseChannelInfo);
            var promise = channelPriceSettingService.addFixedPrice(newData);
            promise.then(function (data) {
                if (data.code == 0) {
                    newData.type='固定单价';
                    channelPriceSettingService.addToList(newData);
                    $scope.alerts.push({type: 'success', msg: '添加固定价格成功！'});
                } else {
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });
    };
    $scope.openAddCFCModal = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'channelPriceModal.html',
            controller: 'InsertAdPriceModalController',
            size: size,
            resolve: {
                row: function () {
                    return {};
                },
                insertDataType: function () {
                    return 'cfc';
                },
                operationType: function(){
                    return 'add';
                }
            }
        });
        modalInstance.result.then(function (modalData) {
            modalData.begin_date = new Date(modalData.begin_date).Format("yyyy-MM-dd");
            modalData.end_date = new Date(modalData.end_date).Format("yyyy-MM-dd");
            var newData = angular.extend( modalData, $scope.choseChannelInfo);
            var promise = channelPriceSettingService.addFixedCost(newData);
            promise.then(function (data) {
                if (data.code == 0) {
                    newData.type = '固定花费';
                    channelPriceSettingService.addToList(newData);
                    $scope.alerts.push({type: 'success', msg: '添加固定花费成功！'});
                } else {
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });
    };
    $scope.openAddCFCPModal = function(size){
        var promise = countryListService.queryUseCountry();
        promise.then(function(data){
            if(data.code != 0){
                $scope.alerts.push({type: 'danger', msg:'获取国家列表失败！' + data.msg});
                return;
            }
            var obj = {
                countrys:data.result
            };

            var modalInstance = $modal.open({
                templateUrl: 'channelPriceModal.html',
                controller: 'InsertAdPriceModalController',
                size: size,
                resolve: {
                    row: function () {
                        return obj;
                    },
                    insertDataType: function () {
                        return 'cfcp';
                    },
                    operationType: function(){
                        return 'add';
                    }
                }
            });
            modalInstance.result.then(function (modalData) {
                var obj = {};
                obj.begin_date = new Date(modalData.begin_date).Format("yyyy-MM-dd");
                obj.end_date = new Date(modalData.end_date).Format("yyyy-MM-dd");
                obj.upper_limit = modalData.upper_limit;
                var codeStr = "", priceStr ="";
                for(var i = 0; i < modalData.countrys.length; i++){
                    var temp = modalData.countrys[i];
                    codeStr += temp.code +',';
                    priceStr += (temp.price ? temp.price : 0) +',';
                }
                obj.codeStr = codeStr;
                obj.priceStr = priceStr;

                var newData = angular.extend(obj, $scope.choseChannelInfo);
                var promise = channelPriceSettingService.addFixedCountryPrice(newData);
                promise.then(function (data) {
                    if (data.code == 0) {
                        newData.type = '国家固定价格';
                        newData.price='/';
                        channelPriceSettingService.addToList(newData);
                        $scope.alerts.push({type: 'success', msg: '添加国家固定价格！'});
                    } else {
                        $scope.alerts.push({type: 'danger', msg: data.msg});
                    }
                });
            }, function () {
            });

        });



    }

    $scope.openUpdateModal = function(size,row){

        if(row.type_id == 1){// 固定花费
            openUpdateCFCModal(size, row);
        }else if(row.type_id == 2){ // 固定价格
            openUpdateCFPModal(size, row);
        }else if(row.type_id ==3){
            openUpdateCFCPModal('lg', row);
        }
    }
    function openUpdateCFCModal(size,row) {
        var modalInstance = $modal.open({
            templateUrl: 'channelPriceModal.html',
            controller: 'InsertAdPriceModalController',
            size: size,
            resolve: {
                row: function () {
                    return row;
                },
                insertDataType: function () {
                    return 'cfc';
                },
                operationType: function(){
                    return 'update';
                }
            }
        });
        modalInstance.result.then(function (modalData) {
            modalData.begin_date = new Date(modalData.begin_date).Format("yyyy-MM-dd");
            modalData.end_date = new Date(modalData.end_date).Format("yyyy-MM-dd");
            var newData = angular.extend( modalData, $scope.choseChannelInfo);
            var promise = channelPriceSettingService.updateFixedCost(newData);
            promise.then(function (data) {
                if (data.code == 0) {
                    newData.type = '固定花费';
                    //channelPriceSettingService.updateList(newData);
                    $scope.alerts.push({type: 'success', msg: '修改固定花费，且重算成本数据成功！'});
                } else {
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });
    };
    function openUpdateCFPModal(size, row) {
        var modalInstance = $modal.open({
            templateUrl: 'channelPriceModal.html',
            controller: 'InsertAdPriceModalController',
            size: size,
            resolve: {
                row: function () {
                    return row;
                },
                insertDataType: function () {
                    return 'cfp';
                },
                operationType: function(){
                    return 'update';
                }
            }
        });
        modalInstance.result.then(function (modalData) {
            modalData.begin_date = new Date(modalData.begin_date).Format("yyyy-MM-dd");
            modalData.end_date = new Date(modalData.end_date).Format("yyyy-MM-dd");
            modalData.upper_limit =  modalData.upper_limit?  modalData.upper_limit : null;
            var newData = angular.extend( modalData, $scope.choseChannelInfo);
            var promise = channelPriceSettingService.updateFixedPrice(newData);
            promise.then(function (data) {
                if (data.code == 0) {
                    newData.type='固定单价';
                    //channelPriceSettingService.updateList(newData);
                    $scope.alerts.push({type: 'success', msg: '修改固定价格，且重算成本数据成功！'});
                } else {
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });
    };
    function openUpdateCFCPModal(size, row) {
        var obj = {id:row.id};
        var promise = channelPriceSettingService.queryFixedCountryPrice(obj);
        promise.then(function(data){
            if(data.code != 0){
                $scope.alerts.push({type: 'danger', msg:'获取国家单价配置失败！' + data.msg});
                return;
            }else{
                row.countrys = data.result;
                var modalInstance = $modal.open({
                    templateUrl: 'channelPriceModal.html',
                    controller: 'InsertAdPriceModalController',
                    size: size,
                    resolve: {
                        row: function () {
                            return row;
                        },
                        insertDataType: function () {
                            return 'cfcp';
                        },
                        operationType: function(){
                            return 'update';
                        }
                    }
                });
                modalInstance.result.then(function (modalData) {
                    var obj = {};
                    obj.begin_date = new Date(modalData.begin_date).Format("yyyy-MM-dd");
                    obj.end_date = new Date(modalData.end_date).Format("yyyy-MM-dd");
                    obj.upper_limit = modalData.upper_limit;
                    var codeStr = "", priceStr ="";
                    for(var i = 0; i < modalData.countrys.length; i++){
                        var temp = modalData.countrys[i];
                        codeStr += temp.code +',';
                        priceStr += (temp.price ? temp.price : 0) +',';
                    }
                    obj.codeStr = codeStr;
                    obj.priceStr = priceStr;
                    var newData = angular.extend( obj, $scope.choseChannelInfo);
                    var promise = channelPriceSettingService.updateFixedCountryPrice(newData);
                    promise.then(function (data) {
                        if (data.code == 0) {
                            newData.type='固定国家单价';
                            //channelPriceSettingService.updateList(newData);
                            $scope.alerts.push({type: 'success', msg: '修改固定国家单价成功，且重算成本数据成功！'});
                        } else {
                            $scope.alerts.push({type: 'danger', msg: data.msg});
                        }
                    });
                }, function () {
                });
            }
        });
    };

    $scope.openDeleteModal = function(size,row){

        if(row.type_id == 1){// 固定花费
            openDeleteCFCModal(size, row);
        }else if(row.type_id == 2){ // 固定价格
            openDeleteCFPModal(size, row);
        }else if(row.type_id ==3){
            openDeleteCFCPModal('lg', row);
        }
    }

    function openDeleteCFCModal(size,row) {
        var modalInstance = $modal.open({
            templateUrl: 'channelPriceModal.html',
            controller: 'InsertAdPriceModalController',
            size: size,
            resolve: {
                row: function () {
                    return row;
                },
                insertDataType: function () {
                    return 'cfc';
                },
                operationType: function(){
                    return 'delete';
                }
            }
        });
        modalInstance.result.then(function () {
            var promise = channelPriceSettingService.delFixedCost({id:row.id});
            promise.then(function (data) {
                if (data.code == 0) {
                    channelPriceSettingService.delFromList(row);
                    $scope.alerts.push({type: 'success', msg: '删除固定花费成功！'});
                } else {
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });
    };
    function openDeleteCFPModal(size,row) {
        var modalInstance = $modal.open({
            templateUrl: 'channelPriceModal.html',
            controller: 'InsertAdPriceModalController',
            size: size,
            resolve: {
                row: function () {
                    return row;
                },
                insertDataType: function () {
                    return 'cfp';
                },
                operationType: function(){
                    return 'delete';
                }
            }
        });
        modalInstance.result.then(function () {
            var promise = channelPriceSettingService.delFixedPrice({id:row.id});
            promise.then(function (data) {
                if (data.code == 0) {
                    channelPriceSettingService.delFromList(row);
                    $scope.alerts.push({type: 'success', msg: '删除固定单价成功！'});
                } else {
                    $scope.alerts.push({type: 'danger', msg: data.msg});
                }
            });
        }, function () {
        });
    };
    function openDeleteCFCPModal(size, row) {
        var obj = {id:row.id};
        var promise = channelPriceSettingService.queryFixedCountryPrice(obj);
        promise.then(function(data){
            if(data.code != 0){
                $scope.alerts.push({type: 'danger', msg:'获取国家单价配置失败！' + data.msg});
                return;
            }else{
                row.countrys = data.result;
                var modalInstance = $modal.open({
                    templateUrl: 'channelPriceModal.html',
                    controller: 'InsertAdPriceModalController',
                    size: size,
                    resolve: {
                        row: function () {
                            return row;
                        },
                        insertDataType: function () {
                            return 'cfcp';
                        },
                        operationType: function(){
                            return 'delete';
                        }
                    }
                });
                modalInstance.result.then(function () {
                    var promise = channelPriceSettingService.delFixedCountryPrice({id:row.id});
                    promise.then(function (data) {
                        if (data.code == 0) {
                            channelPriceSettingService.delFromList(row);
                            $scope.alerts.push({type: 'success', msg: '删除固定国家单价成功！'});
                        } else {
                            $scope.alerts.push({type: 'danger', msg: data.msg});
                        }
                    });
                }, function () {
                });
            }
        });
    };
}]);


/**
 * 录入-投放价格录入弹出框  固定花费格录入 cfc  固定价格录入 cfp 固定国家价格录入 cfcp 及修改、删除
 */
appControllers.controller('InsertAdPriceModalController', ['$scope','$modalInstance','row', 'insertDataType', 'operationType', function ($scope, $modalInstance, row, insertDataType, operationType){
    $scope.insertDataType = insertDataType; // 判断固定花费格录入 cfc  固定价格录入 cfp 固定国家价格录入 cfcp
    $scope.Operation = operationType; // 判断增加、修改、删除
    $scope.readonline = false;
    if( $scope.Operation  =='delete'){
        $scope.readonline = true;
    }

    //if(row.upper_limit == -1){
    //    row.upper_limit = null;
    //}
    $scope.modalData = row;
    if(insertDataType == 'cfc'){
        $scope.typeTitle = '固定花费';
    }else if(insertDataType == 'cfp'){
        $scope.typeTitle = '固定价格';
    }else{
        $scope.typeTitle = '国家固定价格';
        $scope.countrys = row.countrys;
    }

    $scope.title = operationType + $scope.typeTitle;
    $scope.beginDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.beginDateOpened = true;
        $scope.endDateOpened = false;
    };
    $scope.endDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endDateOpened = true;
        $scope.beginDateOpened = false;
    };

    $scope.ok = function () {
        $modalInstance.close($scope.modalData);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

appControllers.controller('countryListController', ['$scope','countryListService', function ($scope, countryListService){
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var promise = countryListService.query();
    promise.then(function(data){
        if(data.code == 0){
            countryListService.countrys = data.result;
            $scope.countrys = data.result;
        }else{
            $scope.alerts.push('danger', data.msg);
        }

    });

    $scope.save = function(){
        var codeStr = "";
        for(var i= 0; i < $scope.countrys.length; i++){
            var temp =  $scope.countrys[i];
            if(temp.status){
                codeStr +=  temp.code +",";
            }
        }
        alert(codeStr);
        var obj ={};
        obj.codeStr = codeStr;
        var promise = countryListService.updateCountrys(obj);
        promise.then(function(data){
            if(data.code == 0){
                $scope.alerts.push({type: 'success', msg: '保存成功！'});
            }else{
                $scope.alerts.push({type: 'danger', msg: data.msg});
            }
        });
    }

    $scope.countrys = countryListService.countrys

    //$scope.$on('countryList.update',function(){
    //    $scope.countrys =  countryListService.countrys;
    //});
}]);

appControllers.controller('mainPageController', ['$scope', '$localStorage','$SharedData',function ($scope, $localStorage ,$SharedData){
    $scope.alerts = [
        { type: 'danger', msg: '测试！~~~~~~~~~~~~~~~~error' },
        { type: 'success', msg: '测试！~~~~~~~~~~~~~~~~success' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'test alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.today = function() {
        $scope.dt = new Date();
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };


    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.addPoints = function () {
        var seriesArray = $scope.highchartsNG.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.highchartsNG.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.highchartsNG.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.options = {
        type: 'line'
    }

    $scope.swapChartType = function () {
        if (this.highchartsNG.options.chart.type === 'line') {
            this.highchartsNG.options.chart.type = 'bar'
        } else {
            this.highchartsNG.options.chart.type = 'line'
        }
    }

    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        title: {
            text: 'Hello'
        },
        loading: false
    }
}]);

/**
 * 弹出框
 */
appControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, data) {
    $scope.media_source = data.media_source;
    $scope.ModalItems = data.items;
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
