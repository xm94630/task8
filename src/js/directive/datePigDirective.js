appDirectives.directive('datePigDirective', function($rootScope,$timeout) {
	return {
	    restrict: 'AE',
	    replace: 'true',
	    templateUrl: './html/directive/datePig.html',
	    scope: {
	        dateInfo: "="
	    },
	    controller:function($scope){
	    },
	    link:function(scope,element,attrs){

	    	var a,b,c,d,span;
	    	var time1,time2,time3,time4;
	    	var parameter = scope.dateInfo;
	    	var a = parameter.sTime[0];
	    	var b = parameter.sTime[1];
	    	var c = parameter.eTime[0];
	    	var d = parameter.eTime[1];
	    	var span = parameter.span;

	    	if(span<=0) error("时间间隔至少为1个月");

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

	    	var isNumber = function(obj){
	    		return Object.prototype.toString.call(obj) == '[object Number]';
	    	}

	    	var isArray = Array.isArray || function(obj){
	    		return Object.prototype.toString.call(obj) == '[object Array]';
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
	    			return ((c-1)-a)*12+((12+d)-b)+1;
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

	    	//组装chosen所需数据
 			yearObj  = packageData(defaultYearList, getRangeByYear ([a,b],[c,d]));
 			monthObj = packageData(defaultMonthList,getRangeByMonth([a,b],[c,d]));

 			//实例化指令
 			scope.chosendata = {
 				item1:{
 					data:yearObj,
 					selected:null,
 					change:function(label,value){
 						
 						//年份改变，重置月份
 						time1 = parseInt(value[0]);
 						monthArr = getValid([a,b],[c,d])('year',time1);
 						scope.chosendata.item2.data     = packageData(defaultMonthList,monthArr);
						scope.chosendata.item2.selected = [time2];

						//如果此时两个年份已经确定，则比较两者大小，有误则重置另一个年份
						if(time1>0 && time3>0){
							if(greaterThan(time1,time3)){
								time3 = time1;
								scope.chosendata.item3.selected = [time3];
								return;
							}
						}

						

 					}
 				},
 				item2:{
 					data:monthObj,
 					selected:null,
 					change:function(label,value){

 						time2 = parseInt(value[0]);

 						//如果此时四个下拉已经确定
 						if(time1>0 && time2>0 && time3>0 && time4>0){

 							//则比较时间大小，有误则重置另一个时间
 							if(greaterThan([time1,time2],[time3,time4])){
 								time3 = time1;
 								time4 = time2;
 								scope.chosendata.item3.selected = [time3];
 								scope.chosendata.item4.selected = [time4];
 								return;
 							}

 							//如果有时间间隔限制
 							if(span){
 								if(getInterval([time1,time2],[time3,time4])>span){
 									warn('时间间隔超过设定，系统自动调整');
 									var arr = addMonth([time1,time2],(span-1));
 									//及时调整时间
 									time3 = arr[0]; 
 									time4 = arr[1]; 
 									scope.chosendata.item3.selected = [time3];
 									scope.chosendata.item4.selected = [time4];
 								}
 							}
 						}

 					}
 				},
 				item3:{
 					data:yearObj,
 					selected:null,
 					change:function(label,value,x,y){

 						//年份改变，重置月份
 						time3 = parseInt(value[0]);
 						monthArr = getValid([a,b],[c,d])('year',time3);
 						scope.chosendata.item4.data     = packageData(defaultMonthList,monthArr);
						scope.chosendata.item4.selected = [time4];

						//如果此时两个年份已经确定，则比较两者大小，有误则重置另一个年份
						if(time1>0 && time3>0){
							if(greaterThan(time1,time3)){
								time1 = time3;
								scope.chosendata.item1.selected = [time1];
								return;
							}
						}

 					}
 				},
 				item4:{
 					data:monthObj,
 					selected:document.querySelector('#chose4 li[data-value="10"]'),
 					change:function(label,value){

 						time4 = parseInt(value[0]);

 						//如果此时四个下拉已经确定
 						if(time1>0 && time2>0 && time3>0 && time4>0){

 							//则比较时间大小，有误则重置另一个时间
 							if(greaterThan([time1,time2],[time3,time4])){
 								time1 = time3;
 								time2 = time4;
 								scope.chosendata.item1.selected = [time1];
 								scope.chosendata.item2.selected = [time2];
 								return;
 							}

 							//如果有时间间隔限制
 							if(span){
 								if(getInterval([time1,time2],[time3,time4])>span){
 									warn('时间间隔超过设定，系统自动调整');
 									var arr = addMonth([time3,time4],-(span-1));
 									//及时调整时间
 									time1 = arr[0]; 
 									time2 = arr[1]; 
 									scope.chosendata.item1.selected = [time1];
 									scope.chosendata.item2.selected = [time2];
 								}
 							}

 						}

 					}
 				}
 			};


 			



	    }
	};
});

