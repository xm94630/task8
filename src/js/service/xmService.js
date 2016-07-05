//自定义服务
appServices.factory('XmService', function ($rootScope) {
    return {
        splat:function(fun){
        	return function(array){
        		return fun.apply(null,array);
        	}
        }
    };
});