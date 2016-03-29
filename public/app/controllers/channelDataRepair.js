/**
 * Created by xiaoyi on 2015/7/24.
 */
'use strict';
app.controller('channelDataRepairController', ['$rootScope', '$scope', '$http'
    , '$timeout', '$q', 'Upload', 'toaster', function ($rootScope, $scope, $http, $timeout, $q, Upload, toaster) {
        // 初始化配置
        $scope.formData = {
            dt: moment().format('YYYY-MM-DD'),
            installs: null,
            regs: null,
            cost: null,
            mediaSource: '',
            addType: false
        }
        $scope.toaster = {
            type: 'success',
            title: 'Title',
            text: 'Body'
        };
        var pop = function (type, title, text) {
            toaster.pop(type, title, text);
        };
        // 时间配置
        $scope.today = function () {
            $scope.formData.dt = moment().format('YYYY-MM-DD');
        };
        $scope.today();

        $scope.clear = function () {
            $scope.formData.dt = null;
        };
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
        // 获取游戏列表
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
                    pop('error', 'error', data.msg);
                    deferred.reject(data);
                });
            return deferred.promise;
        };
        // 添加数据
        $scope.addData = function () {
            var deferred = $q.defer();
            if ($scope.formData.mediaSource == '') {
                $scope.mediaSourceValidateFail = true;
                return;
            }
            $http({
                method: 'POST',
                url: 'api/channel/data/repair/add',
                params: {
                    app_id: $scope.app.selected.app_id,
                    os: $scope.app.selected.os,
                    count_date: moment(new Date($scope.formData.dt)).format('YYYY-MM-DD'),
                    installs: $scope.formData.installs ? $scope.formData.installs : 0,
                    regs: $scope.formData.regs ? $scope.formData.regs : 0,
                    cost: $scope.formData.cost ? $scope.formData.cost : 0,
                    media_source: $scope.formData.mediaSource,
                    type: $scope.formData.addType ? 1 : 0
                }
            }).
                success(function (data, status, headers, config) {
                    if (data.code == 0) {
                        pop('success', 'success', '添加成功');
                        getData();
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

        $scope.delete = function (item) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'api/channel/data/repair/delete',
                params: {
                    count_date: item.countDate,
                    app_id: item.appId,
                    os: item.os,
                    media_source: item.mediaSource,
                    link_media_source: item.linkMediaSource ? item.linkMediaSource : ''
                }
            }).
                success(function (data, status, headers, config) {
                    if (data.code == 0) {
                        pop('success', 'success', '删除成功');
                        getData();
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
        // 获取游戏渠道下的输入数据
        function getData() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'api/channel/data/repair/query',
                params: {
                    app_id: $scope.app.selected.app_id,
                    os: $scope.app.selected.os,
                    count_date: moment($scope.formData.dt).format('YYYY-MM-DD')
                }
            }).
                success(function (data, status, headers, config) {
                    if (data.code != 0) {
                        pop('error', 'error', data.msg);
                    } else {
                        $scope.tableData = [];
                        if (data.result.length < 1) {
                            $scope.noData = true;
                        } else {
                            $scope.noData = false;
                            for (var i = 0; i < data.result.length; i++) {
                                var temp = data.result[i];
                                $scope.tableData.push({
                                    appId: temp.app_id,
                                    countDate: temp.count_date,
                                    gameName: temp.game_name,
                                    os: temp.os,
                                    mediaSource: temp.media_source,
                                    linkMediaSource: temp.link_media_source,
                                    installs: temp.installs,
                                    regs: temp.regs,
                                    roles: temp.roles,
                                    cost: temp.cost
                                });
                            }
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

        // app date都初始化成功后执行查询
        var initCount = 0;
        $scope.$watch('app.selected', function (newValue, oldValue, scope) {
            if (newValue) {
                initCount = initCount < 2 ? initCount + 1 : initCount;
                if (initCount == 2) {
                    getData();
                }
            }
        })
        $scope.$watch('formData.dt', function (newValue, oldValue, scope) {
            if (newValue) {
                initCount = initCount < 2 ? initCount + 1 : initCount;
                if (initCount == 2) {
                    getData();
                }
            }
        })
        // 输入框验证提醒
        $scope.$watch('formData.regs', function (newValue, oldValue, scope) {
            if (!newValue || newValue <= 0) {
                $scope.regsValidateFail = true;
            } else {
                $scope.regsValidateFail = false;
            }
        })
        $scope.$watch('formData.installs', function (newValue, oldValue, scope) {
            if (!newValue || newValue <= 0) {
                $scope.installsValidateFail = true;
            } else {
                $scope.installsValidateFail = false;
            }
        })
        $scope.$watch('formData.cost', function (newValue, oldValue, scope) {
            if (!newValue || newValue <= 0) {
                $scope.costValidateFail = true;
            } else {
                $scope.costValidateFail = false;
            }
        })
        //文件验证
        $scope.$watch('file', function (newValue, oldValue) {
            if (newValue) {
                $scope.showProgressBar = true;

                $scope.upload([$scope.file]);
            }
        });

        //文件上传
        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: 'api/upload/channel-repair-data',
                        fields: {
                            'username': 'xiaoyi'
                        },
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.progressPercent = progressPercentage;
                    }).success(function (data, status, headers, config) {
                        var errorRowNums = [];
                        if (data.code == 200) {
                            if (data.result.errorData.length > 0) {
                                for (var j = 0; j < data.result.errorData.length; j++) {
                                    errorRowNums.push(data.result.errorData[j].num);
                                }
                            }
                            pop('success', '', '共' + data.result.rowCount + '条，上传失败' + data.result.errorData.length
                                + '条，行数分别为：' + errorRowNums.join(','));
                            if (data.result.errorData.length > 0) {
                                alert('错误数据：' + JSON.stringify(data.result.errorData));
                            }
                        } else {
                            pop('error', 'error', data.msg);
                            //alert('数据录入重复或者服务器异常，请检查数据或者稍候再试！');
                        }
                        console.log('file:  Response: ' + JSON.stringify(data));
                    });
                }
            }
        };
        getGames();
    }]);