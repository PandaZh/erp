/**
 * Created by xiaoyi on 2015/8/6.
 */


appServices.factory('$access', function(){
    var service = {
        Access:null,
        Menus:null,
        setAccess: function(Access){
            service.Access = Access;
        },
        getAccess: function(){
            return service.Access;
        },
        setMenus: function(Menus){
            service.Menus = Menus;
        },
        getMenus: function(){
            return service.Menus;
        }
    }
    return service;
});