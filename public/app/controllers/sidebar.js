/**
 * Created by xiaoyi on 2015/8/6.
 */
/**
 * Created by xiaoyi on 2015/8/6.
 */
app.controller('sidebarController', ['$access','$scope','$state',function ($access, $scope,$state) {
    if(!$access.getMenus()){
        $state.go('login');
        return;
    }



    $scope.menus = $access.getMenus();
}]);