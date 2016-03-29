/**
 * Created by xiaoyi on 2015/8/4.
 */
'use strict';
app.controller('oasStepLostController', ['$rootScope', '$scope', '$http', '$timeout', '$q', 'toaster', function ($rootScope, $scope, $http, $timeout, $q, toaster) {
    // 当前选择的参数
    var curParams = null;
    // 选择使用单个时间选择框  1为时间范围
    $scope.datePickerDayDiff = -2; // 默认选择前天
    $scope.datePickerType = 2;
    // 1日、2日7日 选择
    $scope.radioModel = 'one';
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
                var categories =  [];
                var seriesData = [{
                    type:'column',
                    name:'留存人数',
                    data:[]
                },{
                    type:'spline',
                    name:'绝对留存率',
                    data:[]
                },{
                    type:'spline',
                    name:'相对留存率',
                    data:[]
                }];

                for(var i = 0; i < data.result.length; i++){
                    var temp = data.result[i];
                    categories.push(temp.step_name);
                    seriesData[0].data.push(Number(temp.user_count));
                    seriesData[1].data.push(Number(temp.absolute_rate));
                    seriesData[2].data.push(Number(temp.relative_rate));
                }

                drawHighChartLine(categories, seriesData, 'stepLostChart1');
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
            if ($scope.radioModel === 'one') {
                getData('api/oas/steplost-day');
            } else if ($scope.radioModel === 'tow') {
                getData('api/oas/steplost-2day');
            } else {
                getData('api/oas/steplost-7day');
            }
        } else {
            pop('error', 'error', '参数有误，刷新查询失败！')
        }
    }


}]);