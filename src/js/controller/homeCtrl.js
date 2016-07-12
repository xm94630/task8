/**
 * Created by Administrator on 2016/1/27.
 */
appControllers.controller("homeCtrl",function($scope,XmService){

	//这里使用了服务
	var value = XmService.splat(function(x,y){
		return x+y;
	})([1400,8127]);

	//这部分数据是传递给指令用的，用来作为指令的参数
	$scope.pigData={
		/*sTime : ['2016/1','2018/5'],
		eTime : ['2000/5','2019/9']*/
		sTime : ['2016/3','2018/7'],
		eTime : ['2017/9','2019/2']
	};

});