/**
 * Created by xiaoyi on 2015/7/24.
 */
'use strict';
app.controller('channelPriceController', ['$rootScope', '$scope', '$http', '$timeout', '$q', 'toaster', function ($rootScope, $scope, $http, $timeout, $q, toaster) {

    // 隐藏价格列表
    $scope.showPriceList = false;
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Body'
    };
    var pop = function (type, title, text) {
        toaster.pop(type, title, text);
    };
    // 初始化公用日期组件
    var startDate = moment().add(-1, 'days').format('YYYY-MM-DD');
    var endDate = moment().add(-1, 'days').format('YYYY-MM-DD');

    $scope.mediaSource = {};
    // 初始化数据，会出现类似问题 http://book.douban.com/subject/20277919/discussion/54472631/
    $scope.formData = {
        fixedPrice: 0.00,
        fixedCost: 0.00,
        fixedPriceUpperLimit: null,
        fixedCountryPriceUpperLimit: null,
        date: {startDate: startDate, endDate: endDate}
    };
    function getGames() {
        var deferred = $q.defer();
        $http({method: 'GET', url: 'api/games'}).
            success(function (data, status, headers, config) {
                if (data.code != 0) {
                    pop('error', 'error', data.msg);
                } else {
                    $scope.AppAsync = [];
                    for (var i = 0; i < data.result.length; i++) {
                        var temp = data.result[i];
                        $scope.AppAsync.push({name: temp.game_name, app_id: temp.game_id, os: 1}, {
                            name: temp.game_name,
                            app_id: temp.game_id,
                            os: 2
                        });
                    }
                    $scope.app = {selected: $scope.AppAsync[0]};
                }


                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                pop('error', '链接异常', data);
                deferred.reject(data);
            });
        return deferred.promise;
    };
    function getMediaSourceByAppId() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'api/app/media_source/All?app_id=' + $scope.app.selected.app_id + '&os=' + $scope.app.selected.os
        })
            .success(function (data, status, headers, config) {
                if (data.code != 0) {
                    pop('error', 'error', data.msg);
                } else {
                    $scope.mediaSources = [];
                    for (var i = 0; i < data.result.length; i++) {
                        var temp = data.result[i];
                        var obj = {
                            name: temp.media_source,
                            settingCount: temp.count,
                            maxEndDate: temp.end_date,
                            nowDayDiff: temp.nowDayDiff // 最后设置时间距今天数（值为负数说明设置时间大于今天）
                        };
                        console.dir(obj);
                        $scope.mediaSources.push(obj);
                    }
                }


                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                pop('error', '链接异常', data);
                deferred.reject(data);
            });
        return deferred.promise;
    };
    function getCountrys() {
        var deferred = $q.defer();
        $http({method: 'GET', url: 'api/country/use'}).
            success(function (data, status, headers, config) {
                if (data.code != 0) {
                    pop('error', 'error', data.msg);
                } else {
                    $scope.countrys = [];
                    for (var i = 0; i < data.result.length; i++) {
                        var temp = data.result[i];
                        $scope.countrys.push(temp);
                    }
                }

                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                pop('error', '链接异常', data);
                deferred.reject(data);
            });
        return deferred.promise;
    }

    getGames()
        .then(getMediaSourceByAppId)
        .then(getCountrys);

    var getPriceDetail = function (mediaSource) {
        $scope.showPriceList = true;
        $timeout(function () {
            $scope.showAddFrom = true;
        }, 1000);
        if (mediaSource) {
            $scope.mediaSource = {selected: mediaSource};
        }
        $http({
            method: 'GET',
            url: 'api/channelPrice',
            params: {
                app_id: $scope.app.selected.app_id,
                os: $scope.app.selected.os,
                media_source: $scope.mediaSource.selected.name
            }
        }).success(function (data, status, headers, config) {
            if (data.code != 0) {
                pop('error', 'error', data.msg);
            } else {
                $scope.priceList = [];
                if (data.result.length <= 0) {
                    $scope.noPriceData = true;
                    return;
                }
                $scope.noPriceData = false;
                for (var i = 0; i < data.result.length; i++) {
                    var temp = data.result[i];
                    $scope.priceList.push({
                        id: temp.id,
                        beginDate: temp.begin_date,
                        upperLimit: temp.upper_limit,
                        endDate: temp.end_date,
                        type: temp.type,
                        typeId: temp.type_id,
                        price: temp.price
                    });

                }
            }


        }).
            error(function (data, status, headers, config) {
                pop('error', '链接异常', data);
            });

    }

    // 点击事件
    $scope.getPriceDetail = function (mediaSource) {
        getPriceDetail(mediaSource)
    };

    var init = true;
    $scope.$watch('app.selected', function () {
        if (!init) {
            getMediaSourceByAppId();
        }
        init = false;

    })

    $scope.addFixedCost = function () {
        var deferred = $q.defer();
        if (!isNaN($scope.formData.fixedCost) && $scope.formData.fixedCost > 0) {
            $scope.isOKFC = false;
        } else {
            $scope.isOKFC = true;
            return;
        }
        $http({
            method: 'POST',
            url: 'api/channelPrice/cfc/add',
            params: {
                app_id: $scope.app.selected.app_id,
                os: $scope.app.selected.os,
                media_source: $scope.mediaSource.selected.name,
                begin_date: moment($scope.formData.date.startDate).format('YYYY-MM-DD'),
                end_date: moment($scope.formData.date.endDate).format('YYYY-MM-DD'),
                price: $scope.formData.fixedCost
            }
        }).
            success(function (data, status, headers, config) {
                if (data.code == 0) {
                    pop('success', '', '添加成功');
                    $scope.formData.fixedCost = 0;
                } else {
                    pop('error', '添加失败', data.msg);
                }
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                pop('error', '链接异常', data);
                deferred.reject(data);
            });
        return deferred.promise;
    }
    $scope.addFixedPrice = function () {
        var deferred = $q.defer();
        if (!isNaN($scope.formData.fixedPrice) && $scope.formData.fixedPrice > 0) {
            $scope.isOKFP = false;
        } else {
            $scope.isOKFP = true;
            return;
        }
        $http({
            method: 'POST',
            url: 'api/channelPrice/cfp/add',
            params: {
                app_id: $scope.app.selected.app_id,
                os: $scope.app.selected.os,
                media_source: $scope.mediaSource.selected.name,
                begin_date: moment($scope.formData.date.startDate).format('YYYY-MM-DD'),
                end_date: moment($scope.formData.date.endDate).format('YYYY-MM-DD'),
                price: $scope.formData.fixedPrice,
                upper_limit: $scope.formData.fixedPriceUpperLimit
            }
        }).
            success(function (data, status, headers, config) {
                if (data.code == 0) {
                    pop('success', 'success', '添加成功');
                } else {
                    pop('error', '添加失败', data.msg);
                }
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                pop('error', '链接异常', data);
                deferred.reject(data);
            });
        return deferred.promise;
    }
    $scope.addFixedCountryPrice = function () {
        var deferred = $q.defer();
        var codeStr = "", priceStr = "";
        for (var i = 0; i < $scope.countrys.length; i++) {
            var temp = $scope.countrys[i];
            codeStr += temp.code + ',';
            priceStr += (!isNaN(temp.price) ? temp.price : 0) + ',';
        }

        $http({
            method: 'POST',
            url: 'api/channelPrice/cfcp/add',
            params: {
                app_id: $scope.app.selected.app_id,
                os: $scope.app.selected.os,
                media_source: $scope.mediaSource.selected.name,
                begin_date: moment($scope.formData.date.startDate).format('YYYY-MM-DD'),
                end_date: moment($scope.formData.date.endDate).format('YYYY-MM-DD'),
                priceStr: priceStr,
                codeStr: codeStr,
                upper_limit: $scope.formData.fixedCountryPriceUpperLimit
            }
        }).
            success(function (data, status, headers, config) {
                if (data.code == 0) {
                    pop('success', 'success', '添加成功');
                } else {
                    pop('error', 'error', data.msg);
                }
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    }
    $scope.deletePrice = function (channelPrice) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: 'api/channelPrice/delete',
            params: {
                setting_date_id: channelPrice.id,
                type_id: channelPrice.typeId
            }
        }).
            success(function (data, status, headers, config) {
                if (data.code == 0) {
                    pop('success', 'success', '删除成功');
                    getPriceDetail();
                } else {
                    pop('error', 'error', data.msg);
                }
                deferred.resolve();
            }).
            error(function (data, status, headers, config) {
                pop('error', '链接异常', data);
                deferred.reject(data);
            });
        return deferred.promise;

    }
}]);