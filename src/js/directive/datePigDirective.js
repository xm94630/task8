appDirectives.directive('datePigDirective', function($rootScope) {
	return {
	    restrict: 'AE',
	    replace: 'true',
	    templateUrl: './html/directive/datePig.html',
	    scope: {
	        dateInfo: "=dateInfo"
	    },
	    //controller中的代码会比link中的先行
	    //另外controller中的$scope和link中的scope是同一个对象
	    //controller可用于实现指令之间的通讯
	    controller:function($scope){
	    },
	    link:function(scope,element,attrs){

	    	//比较有意思的几组关系
	    	//l(element[0] == document.getElementById("date"))
	    	//l(scope == $rootScope.$$childHead)
	    	//l(scope == $rootScope.$$childTail)
	    	//l(scope.$parent == $rootScope)
	    	
	    	//通过attrs可以获取指令属性，注意如果是以xxx-yyy的属性，在这里读取的是xxxYyy格式
	    	//这样子得到的属性值是没有渲染的。
	    	//l(attrs.dateInfo);

	    	//这个scope是该指令私有的，可以绑定对应模板中的数据
			scope.name = '猪猪时间选择器';

			//这里就保存了外部传入的数据
			l(scope.dateInfo);

			//chosen初始设置
			var newData =[{
			    group: "none",
			    label: "年份",
			    value: "-1"
			},{
			    group: "none",
			    label: "2010",
			    value: "2010"
			}];
			scope.chosendata1 = newData;

			//chosen初始设置
			var newData2 =[{
			    group: "none",
			    label: "月份",
			    value: "-1"
			},{
			    group: "none",
			    label: "1月",
			    value: "1"
			}];
			scope.chosendata2 = newData2;

			//chosen初始设置
			var newData3 =[{
			    group: "none",
			    label: "年份",
			    value: "-1"
			},{
			    group: "none",
			    label: "2010",
			    value: "2010"
			}];
			scope.chosendata3 = newData3;

			//chosen初始设置
			var newData4 =[{
			    group: "none",
			    label: "月份",
			    value: "-1"
			},{
			    group: "none",
			    label: "1月",
			    value: "1"
			}];
			scope.chosendata4 = newData4;







	    }
	};
});
