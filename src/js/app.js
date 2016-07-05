/* 作者：xm94630
 * 创建实例
 * angular.module第一个参数是模块“引用名”，模块间可以通过它引入依赖
 * 第11行代码中括号中就是通过“引用名”对模块的依赖引用，模块也可以理解为类似插件、服务的概念
 * “ui.bootstrap”模块定义是在script标签中引入的
 */
var	appServices    = angular.module('xmApp.services',[]),
    appDirectives  = angular.module('xmApp.directives',[]),
    appControllers = angular.module('xmApp.controllers',[]),
    appFilters     = angular.module('xmApp.filters',[]),
    xmApp          = angular.module('XM',['ui.router','ui.bootstrap','xmApp.services','xmApp.directives','xmApp.controllers','xmApp.filters']);
 
xmApp
	//全局变量注入
	.constant('HERO',{
		HP:1000,
		MP:2000
	})
    .run(function($rootScope, $state, $stateParams) {
    	//绑到根作用域，方便获得当前状态
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });