/**
 * Created by xiaoyi on 2015/8/6.
 */
app.controller('loginController', ['$rootScope','$scope','$http','$timeout','$q','$state','$access',function ($rootScope, $scope, $http, $timeout, $q, $state,$access) {
    $scope.login = function () {
        localStorage.clear();
        var username = $scope.username;
        var pwd = $scope.password;
        if (username && pwd) {
            $http({
                method: 'GET',
                url: 'api/user/login',
                params: {
                    username: username,
                    password: pwd
                }
            }).
                success(function (data, status, headers, config) {
                    if(data.code == 0){
                        $access.setAccess(data.result.access);
                        $access.setMenus(data.result.menus);
                        var defaultMenuUrl = '';
                        outerLoop: //命名外圈循环语句
                        for(var i =0 ; i < data.result.menus.length; i++){
                            var temp =data.result.menus[i];
                            if(temp.menu_url){
                                defaultMenuUrl = temp.menu_url;
                                break outerLoop;
                            }
                            for(var j = 0; j < temp.children.length; j++){
                                var temp2 = temp.children[j];
                                if(temp2.menu_url){
                                    defaultMenuUrl = temp2.menu_url;
                                    break outerLoop;
                                }
                                for(var k = 0; k < temp2.children.length; k++){
                                    var temp3 = temp2.children[k];
                                    if(temp3.menu_url){
                                        defaultMenuUrl = temp3.menu_url;
                                        break outerLoop;
                                    }
                                }
                            }
                        }

                        $state.go(defaultMenuUrl);
                    }else{
                        alert(data.msg);
                    }

                }).
                error(function (data, status, headers, config) {
                });


        } else {
            alert('请输入用户名或者密码');
        }
    }


}]);