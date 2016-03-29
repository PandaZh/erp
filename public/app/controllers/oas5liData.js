/**
 * Created by xiaoyi on 2015/8/4.
 */
'use strict';
app.controller('oas5liDataController', ['$rootScope', '$scope', '$http', '$timeout', '$q', 'toaster', function ($rootScope, $scope, $http, $timeout, $q, toaster) {
    // 当前选择的参数
    var curParams = null;
    // 选择使用单个时间选择框  1为时间范围
    $scope.datePickerType = 2;
    // 日 周 月 选择
    $scope.radioModel = 'day';
    // 监听日周月看盘切换事件
    $scope.$watch('radioModel', function (newValue, oldValue) {
        if (newValue && curParams) {
            refreshData();
        }
    })
    // 初始化提示框
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Body'
    };
    var pop = function (type, title, text) {
        toaster.pop(type, title, text);
    };

    /**
     * 获取开始时间8天内所有的时间
     * @returns {Array}
     */
    function getDays() {
        var date = [];

        var begin_date = curParams.curDate;
        if ($scope.radioModel == 'month') {
            begin_date = moment(curParams.curDate).startOf('month').format('YYYY-MM-DD');
        } else if ($scope.radioModel == 'week') {
            begin_date = moment(curParams.curDate).startOf('week').format('YYYY-MM-DD');
        }
        var i = 0;
        while (i <= 7) {
            date.push(moment(begin_date).add(0 - i, $scope.radioModel + 's').format('YYYY-MM-DD'));
            i = i + 1;
        }
        return date;
    }

    function getData(url) {
        $scope.dates = getDays();
        $http({
            url: url,
            method: 'GET',
            params: curParams
        }).success(function (data, header, config, status) {
            if (data.code == 0) {
                if (data.result.length < 1) {
                    $scope.noData = true;
                    return;
                } else {
                    $scope.noData = false;
                }

                data.result.shift() //特殊：第一个为无效数据 { "fn_oas_fivepower_day": null},

                var todayData = {
                    regCount: 0,
                    newUserActiveCount: 0,
                    loginCount: 0,
                    oldUserActiveCount: 0,
                    activeCount: 0,
                    payRate: 0,
                    payCount: 0,
                    payMoney: 0,
                    arpu: 0
                }
                var yesterData = {
                    regCount: 0,
                    newUserActiveCount: 0,
                    loginCount: 0,
                    oldUserActiveCount: 0,
                    activeCount: 0,
                    payRate: 0,
                    payCount: 0,
                    payMoney: 0,
                    arpu: 0
                }
                for (var i = 0; i < data.result.length; i++) {
                    var temp = data.result[i];
                    if (parseInt(temp.point_type) == 1) {
                        todayData.payMoney = Number(temp.date8_value);
                        yesterData.payMoney = Number(temp.date7_value);
                    } else if (parseInt(temp.point_type) == 2) {
                        todayData.payCount = Number(temp.date8_value);
                        yesterData.payCount = Number(temp.date7_value);
                    } else if (parseInt(temp.point_type) == 3) {
                        todayData.loginCount = Number(temp.date8_value);
                        yesterData.loginCount = Number(temp.date7_value);
                    }
                    else if (parseInt(temp.point_type) == 6) {
                        todayData.activeCount = Number(temp.date8_value);
                        yesterData.activeCount = Number(temp.date7_value);
                    } else if (parseInt(temp.point_type) == 14) {
                        todayData.newUserActiveCount = Number(temp.date8_value);
                        yesterData.newUserActiveCount = Number(temp.date7_value);
                    } else if (parseInt(temp.point_type) == 20) {
                        todayData.oldUserActiveCount = Number(temp.date8_value);
                        yesterData.oldUserActiveCount = Number(temp.date7_value);
                    } else if (parseInt(temp.point_type) == 8) {
                        todayData.payRate = Number(temp.date8_value);
                        yesterData.payRate = Number(temp.date7_value);
                    } else if (parseInt(temp.point_type) == 13) {
                        todayData.regCount = Number(temp.date8_value);
                        yesterData.regCount = Number(temp.date7_value);
                    }
                    todayData.arpu = todayData.payCount == 0 ? 0 : todayData.payMoney / todayData.payCount;
                    yesterData.arpu = yesterData.payCount == 0 ? 0 : yesterData.payMoney / yesterData.payCount;
                }

                $scope.todayData = todayData;
                $scope.yesterData = yesterData;
                $scope.tableData = data.result;
            } else {
                pop('error', 'error', data.msg);
            }
        }).error(function (data, header, config, status) {
            pop('error', '链接异常', data);
        });
    }

    /**
     * 监听查询事件
     */
    $scope.$on("oasQuery", function (event, params) {
        curParams = params;
        refreshData();
    })

    /**
     * 刷新数据
     */
    var refreshData = function () {
        if (curParams) {
            if ($scope.radioModel === 'day') {
                getData('api/oas/5li-day');
            } else if ($scope.radioModel === 'week') {
                getData('api/oas/5li-week');
            } else {
                getData('api/oas/5li-month');
            }
        } else {
            pop('error', 'error', '参数有误，刷新查询失败！')
        }
    }


}]);