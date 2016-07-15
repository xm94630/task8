//hah
appDirectives.directive('datePigDirective', function($rootScope,$timeout) {
	return {
	    restrict: 'AE',
	    replace: 'true',
	    templateUrl: './html/directive/datePig.html',
	    //这里的值来自于指令上
	    scope: {
	        dateInfo: "="
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



 			/********************************************
			 * 全局变量区域                               *
 			 ********************************************/

			//时间参数对象
			var a,b,c,d,aa,bb,cc,dd,
			    time1,time2,time3,time4,
			    t = null;
			var defaultYearList = {
				group: "title",
				label:"年份",
				value: "-1"
			};
			var defaultMonthList = {
				group: "title",
				label:"月份",
				value: "-1"
			};


			/********************************************
			 * 自定义函数区域                             *
 			 ********************************************/

			var isArray = Array.isArray || function(obj){
				return Object.prototype.toString.call(obj) == '[object Array]';
			}

			function isString(obj){
				return Object.prototype.toString.call(obj) == '[object String]';
			}

			function isNumber(obj){
				return Object.prototype.toString.call(obj) == '[object Number]';
			}

			function error(info){
				throw new Error(info);
			}

			function warn(info){
				console.log('[warn]'+info);
			}

			//在年月时间基础上，加上n月，返回新的年月
			//addMonth([2001,9],5) => [2002,2]
			function addMonth(arr,n){

				var year = arr[0];
				var month = arr[1];
				var addY;
				if(n>=0){
					if(n>12){
						addY = n%12;
						year += addY;
					}else{
						month += n;
					}
					if(month>12){
						month -= 12;
						year  += 1;
					}
				}else{
					if(n<-12){
						addY  = n%12;
						year += addY;
					}else{
						month += n;
					}
					if(month<=0){
						month  = month+12;
						year  -= 1;
					}
				}		
				return [year,month]	

			}

			//解析指令的参数，返回对象
			function parseParameter(data){

				var sTime_min,sTime_max,eTime_min,eTime_max;
				var bool,reg,a,b,c,d,aa,bb,cc,dd;
				reg  = /^\d{4}\/\d{1,2}$/;

				//参数都是数组
				if(isArray(data.sTime) && isArray(data.eTime)){

					sTime_min = data.sTime[0]; //开始时间 可选最小范围				
					sTime_max = data.sTime[1]; //开始时间 可选最大范围				
					eTime_min = data.eTime[0]; //结束时间 可选最小范围			
					eTime_max = data.eTime[1]; //结束时间 可选最大范围

					bool = reg.test(sTime_min) &&
						   reg.test(sTime_max) &&
						   reg.test(eTime_min) &&
						   reg.test(eTime_max);
					if(!bool) error('时间格式有误,请符合 YYYY/MM 格式');
					
					a  = parseInt(sTime_min.split('/')[0]);
					b  = parseInt(sTime_min.split('/')[1]);
					c  = parseInt(sTime_max.split('/')[0]);
					d  = parseInt(sTime_max.split('/')[1]);
					aa = parseInt(eTime_min.split('/')[0]);
					bb = parseInt(eTime_min.split('/')[1]);
					cc = parseInt(eTime_max.split('/')[0]);
					dd = parseInt(eTime_max.split('/')[1]);

				//参数为数组和数字
				}else if(isArray(data.sTime) && isNumber(data.eTime)){

					var n = data.eTime;

					sTime_min = data.sTime[0]; //开始时间 可选最小范围				
					sTime_max = data.sTime[1]; //开始时间 可选最大范围	
					bool = reg.test(sTime_min) &&
						   reg.test(sTime_max);
					if(!bool) error('时间格式有误,请符合 YYYY/MM 格式');
					
					a  = parseInt(sTime_min.split('/')[0]);
					b  = parseInt(sTime_min.split('/')[1]);
					c  = parseInt(sTime_max.split('/')[0]);
					d  = parseInt(sTime_max.split('/')[1]);	
					aa = addMonth([a,b],n)[0];		
					bb = addMonth([a,b],n)[1];		
					cc = addMonth([c,d],n)[0];		
					dd = addMonth([c,d],n)[1];		

				//参数是数字和数组
				}else if(isNumber(data.sTime) && isArray(data.eTime)){

					var n = data.sTime;

					eTime_min = data.eTime[0]; //结束时间 可选最小范围			
					eTime_max = data.eTime[1]; //结束时间 可选最大范围	
					bool = reg.test(eTime_min) &&
						   reg.test(eTime_max);
					if(!bool) error('时间格式有误,请符合 YYYY/MM 格式');
					
					aa = parseInt(eTime_min.split('/')[0]);
					bb = parseInt(eTime_min.split('/')[1]);
					cc = parseInt(eTime_max.split('/')[0]);
					dd = parseInt(eTime_max.split('/')[1]);	
					a  = addMonth([aa,bb],-n)[0];		
					b  = addMonth([aa,bb],-n)[1];		
					c  = addMonth([cc,dd],-n)[0];		
					d  = addMonth([cc,dd],-n)[1];

				}else{
					error('实例化参数有误');
				}
			    
				
				
				if(a<0 ||c<0 ||aa<0 ||cc<0 ) error('不支持公元前的年份');
				if(b>12||d>12||bb>12||dd>12) error('月份不得大于12');
				
				return {
					s:{
					    min:{
					    	year  : a,
					    	month : b
					    },
					    max:{
					    	year  : c,
					    	month : d
					    }
					},
					e:{
						min:{
							year  : aa,
							month : bb
						},
						max:{
							year  : cc,
							month : dd
						}
					}
				}

			}

			/* 
			 * 时间大小比较
			 * 支持单独的年、月、组合年月大小的比较，用法：
			 * greaterThan([1998,2],[1998,1]) 返回true
			 * greaterThan(1998,1997) 返回true
			 */
			function greaterThan(time1,time2){
				if(isNumber(time1) && isNumber(time2)){
					if(time1>time2) return true; 
				}else if(isArray(time1) && isArray(time2)){
					var a = time1[0],  
						b = time1[1],
						c = time2[0],
						d = time2[1];
					if(a>c||(a==c)&&(b>d)){
						return true;
					}
				}else{
					error('greaterThan:参数类型有误！');
				}
				return false;
			}

			function equalTo(time1,time2){
				if(isNumber(time1) && isNumber(time2)){
					if(time1==time2) return true; 
				}else if(isArray(time1) && isArray(time2)){
					var a = time1[0],  
						b = time1[1],
						c = time2[0],
						d = time2[1];
					if((a==c)&&(b==d)){
						return true;
					}
				}else{
					error('greaterThan:参数类型有误！');
				}
				return false;
			}

			function lessThan(time1,time2){
				return !greaterThan(time1,time2) && !equalTo(time1,time2);
			}

			//获取时间间隔,以月份为返回单位
			//getInterval([2001,1],[2002,12]) =>24
			function getInterval(time1,time2){
				var a = time1[0],  
					b = time1[1],
					c = time2[0],
					d = time2[1];
				if (greaterThan(time1,time2)) return;
				if(c>=a && d>=b){
					//时间间隔为一年以上
					return (c-a)*12+(d-b)+1; 
				}else if(c>a && d<b){
					//时间间隔为一年以及一年以内
					return ((c-1)-a)*12+((12+d)-b);
				}

			}

			/* 
			 * 时间校验规则
			 * 传入两个时间，比较器函数，回调函数
			 * 当满足比较器时，触发回调
			 */
			function rule(time1,time2,comparator,fun){
				if(comparator(time1,time2)) fun();
			}

			//校验并修正数据,返回修正后的对象
			function checkTime(t){

				var sMinY = t.s.min.year;
				var sMinM = t.s.min.month;
				var sMaxY = t.s.max.year;
				var sMaxM = t.s.max.month;
				var eMinY = t.e.min.year;
				var eMinM = t.e.min.month;
				var eMaxY = t.e.max.year;
				var eMaxM = t.e.max.month;

				//校验
				rule([sMinY,sMinM],[sMaxY,sMaxM],greaterThan,function(){
					error('开始时间的最小范围不得大于最大范围!');
				});
				rule([eMinY,eMinM],[eMaxY,eMaxM],greaterThan,function(){
					error('结束时间的最小范围不得大于最大范围!');
				});
				rule([sMinY,sMinM],[eMinY,eMinM],greaterThan,function(){
					warn('开始时间的最小范围大于结束时间的最小范围，系统已调整');
					t.e.min.year  = sMinY;
					t.e.min.month = sMinM;
				});
				rule([sMaxY,sMaxM],[eMaxY,eMaxM],greaterThan,function(){
					warn('开始时间的最大范围大于结束时间的最大范围，系统已调整');
					t.e.max.year  = eMaxY;
					t.e.max.month = eMaxM;
				});
				return t;

			}
            
            //获取年份的范围
            //getRangeByYear([2002,1],[2005,12]) =>[2002, 2003, 2004, 2005]
			function getRangeByYear(time1,time2){
				var i,arr = [],
					a = time1[0],  
					b = time1[1],
					c = time2[0],
					d = time2[1];
				if (greaterThan(time1,time2)) return;
				for(i=a;i<=c;i++){
					arr.push(i);
				}
				return arr;
			}

            //获取月份的范围
            //getRangeByMonth([2016,9],[2017,1]) =>[1, 9, 10, 11, 12]
			function getRangeByMonth(time1,time2){
				var i,arr = [],
					a = time1[0],  
					b = time1[1],
					c = time2[0],
					d = time2[1];
				if (greaterThan(time1,time2)) return;
				//超过12月，所有月份可选
				if(getInterval(time1,time2)>=12){
					for(i=1;i<=12;i++){
						arr.push(i);
					}
					return arr;
				//不到12月
				}else{
				 	//同年
					if(a==c){
						for(i=b;i<=d;i++){
							arr.push(i);
						}
						return arr;
					//其他
					}else{
						for(i=b;i<=12;i++){
							arr.push(i);
						}
						for(i=1;i<=d;i++){
							arr.push(i);
						}
						arr.sort(function(x,y){
							return x>y;
						})
						return arr;
					}
				}
				return;
			}

			//获取两个数之间以1递增的序列，以数组形式返回
 			//getRange(3,6); -> 返回[3,4,5,6]
 			function getRange(a,b){
 				var i,
 					arr=[];
 				if(a>b) return error('getRange:第一个参数必须小于第二个参数');
 				for(i=a;i<=b;i++){
 					arr.push(i);
 				}
 				return arr;
 			}

 			//是否同年
 			function isSameYear(time1,time2){
 				if(getRangeByYear(time1,time2).length==1){
 					return true;
 				}
 			}

 			//是否跨年
 			function isTransYear(time1,time2){
 				if(getRangeByYear(time1,time2).length==2){
 					return true;
 				}
 			}

 			//是否多年
 			function isSeveralYear(time1,time2){
 				if(getRangeByYear(time1,time2).length>2){
 					return true;
 				}
 			}

 			//高阶函数
 			//getValid([2010,6],[2013,2])('month',11)   => [2010, 2011, 2012]
 			//getValid([2010,6],[2013,2])('year' ,2013) => [1,2]
 			function getValid(time1,time2){
 				return function(type,x){
 					var i,
 					    arr  = [],
 					    obj  = {},
 					    obj2 = {},
 					    firstArr  = [],
 					    secondArr = [],
 						a    = time1[0],  
 						b    = time1[1],
 						c    = time2[0],
 						d    = time2[1];

 					if(type=='year'){

 						if(isSameYear(time1,time2)){
 							obj[a] = getRange(b,d);
 						}else if(isTransYear(time1,time2)){
 							obj[a] = getRange(b,12);
 							obj[c] = getRange(1,d);
 						}else if(isSeveralYear(time1,time2)){
 							for(i=a;i<=c;i++){
 								if(i==a){
									obj[a] = getRange(b,12);
 								}else if(i==c){
 									obj[c] = getRange(1,d);
 								}else{
 									obj[i] = getRange(1,12);
 								}
 							}
 						}

 					}else if(type=='month'){

 						if(isSameYear(time1,time2)){
 							arr.push(a);
 						}else{

 							//递归调用
 							firstArr  = getValid(time1,time2)('year' ,a);
 							secondArr = getValid(time1,time2)('year' ,c);
 							
 							//只需对首尾两个年份做判断
 							if(firstArr.indexOf(x) !=-1){
 								arr.push(a);
 							}
 							if(secondArr.indexOf(x)!=-1){
 								arr.push(c);
 							}
 							
 							//剩余年份都是有1-12月份
 							if(c-a>=2){
								for(i=a+1;i<c;i++){
									arr.push(i);
								}
 							}
 							arr.sort(function(x,y){
 								return x>y;
 							});
 						}

 						return arr;
 						
 					}

 					return obj[x] || warn('参数不在提供的时间范围中');
 				}

 			}

 			//组装chose所需的数据格式
 			function packageData(defaultObj,rangeArr){
 				var arr = [];
 				arr.push(defaultObj);
 				rangeArr.forEach(function(item){
 					arr.push({
 						group: "none",
	 				    label: item,
	 				    value: item
 					});
 				});
 				return arr;
 			}



 			/********************************************
			 * 核心逻辑区域                               *
 			 ********************************************/

			//获取时间参数对象
			t  = parseParameter(scope.dateInfo);
			
			//校验时间
			t  = checkTime(t);

			//获取年、月
			a  = t.s.min.year;  //开始时间最小范围的年份
			b  = t.s.min.month; //开始时间最小范围的月份
			c  = t.s.max.year;  //开始时间最大范围的年份
			d  = t.s.max.month; //开始时间最大范围的月份
			aa = t.e.min.year;  //结束时间最小范围的年份
			bb = t.e.min.month; //结束时间最小范围的月份
			cc = t.e.max.year;  //结束时间最大范围的年份
			dd = t.e.max.month; //结束时间最大范围的月份
		    
			//组装chosen所需数据
 			scope.chosendata1 = packageData(defaultYearList, getRangeByYear ([a,b],[c,d]));
 			scope.chosendata2 = packageData(defaultMonthList,getRangeByMonth([a,b],[c,d]));
 			scope.chosendata3 = packageData(defaultYearList, getRangeByYear ([aa,bb],[cc,dd]));
 			scope.chosendata4 = packageData(defaultMonthList,getRangeByMonth([aa,bb],[cc,dd]));
 			
 			//实例化指令
 			scope.chosendata = {
 				item1:{
 					data:scope.chosendata1,
 					selected:null,
 					change:function(label,value){
 						
 						time1 = parseInt(value[0]);
						//获取选中当前年份的有效月份
 						monthArr = getValid([a,b],[c,d])('year',time1);
 						//年份改变，改变月份（第2个下拉框）
 						scope.chosendata.item2.data     = packageData(defaultMonthList,monthArr);
						scope.chosendata.item2.selected = [time2];
						//如果开始年份大于结束年份，则取同（结束年份修正为开始年份）
						if(time3){
							rule(time1,time3,greaterThan,function(){
								scope.chosendata.item3.selected = [time1];
								warn('开始年份大于结束年份,修正取同');
							});
						}	

 					}
 				},
 				item2:{
 					data:scope.chosendata2,
 					selected:null,
 					change:function(label,value){

 						time2 = parseInt(value[0]);
 						//其他三项已经填值了，就可以判断整体时间的大小了
 						if(time1 && time2!=-1 && time3 && time4!=undefined && time4!=-1 ){
 							rule([time1,time2],[time3,time4],greaterThan,function(){
 								scope.chosendata.item4.selected = [time2];
 								warn('开始时间大于结束时间,修正结束时间的月份');
 							});
 						}

 					}
 				},
 				item3:{
 					data:scope.chosendata3,
 					selected:null,
 					change:function(label,value,x,y){

						time3 = parseInt(value[0]);
						//获取选中当前年份的有效月份
 						monthArr = getValid([aa,bb],[cc,dd])('year',time3);
 						//年份改变，改变月份（第4个下拉框）
 						scope.chosendata.item4.data = packageData(defaultMonthList,monthArr);
						scope.chosendata.item4.selected = [time4];
						//如果开始年份大于结束年份，则取同（开始年份修正为结束年份）
						if(time1){
							rule(time1,time3,greaterThan,function(){
								scope.chosendata.item1.selected = [time3];
								warn('开始年份大于结束年份,修正取同');
							});
						}
						
 					}
 				},
 				item4:{
 					data:scope.chosendata4,
 					selected:document.querySelector('#chose4 li[data-value="10"]'),
 					change:function(label,value){

						//其他三项已经填值了，就可以判断整体时间的大小了
						time4 = parseInt(value[0]);
 						if(time1 && time2!=undefined && time2!=-1 && time3 && time4!=-1){
 							rule([time1,time2],[time3,time4],greaterThan,function(){
 								scope.chosendata.item2.selected = [time4];
 								warn('开始时间大于结束时间,修正结束时间的月份');
 							});
 						}

 					}
 				}
 			};






	    }
	};
});

