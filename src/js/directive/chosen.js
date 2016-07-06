appDirectives.directive('chosenDirective', function($timeout) {
    return {
        scope: {
            'setSelected': '=',
            'changeFunction': '=',
            'chosenData': '='
        },
        require: "?ngModel",
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: './html/directive/chosen.html',
        transclude: true,
        compile: function(tEle, tAttr, transcludeFn) {
            return function(scope, element, attrs, ngModel) {
                var _defaultResult = [];
                scope.isOpen = false;
                //是否显示搜索
                scope.chosenSearch = !attrs['isHaveSearch'];
                //是否单选
                scope.isSingle = !attrs['isMulit'] || false;

                var selectedDom = [],
                    selectedClass = 'highlighted';

                scope.mouseover = function(e) {
                    if (optionStatus(angular.element(e.target))) return;
                    angular.element(e.target).addClass('highlighted');
                }
                scope.mouseleave = function(e) {
                    if (optionStatus(angular.element(e.target))) return;
                    angular.element(e.target).removeClass('highlighted');
                }
                scope.clickoption = function(e) {
                    if (optionStatus(angular.element(e.target))) return;
                    //重置
                    scope.searchVal = '';
                    scope.results = _defaultResult;

                    setSelected(angular.element(e.target));
                    scope.isOpen = false;
                }

                scope.openDrop = function() {
                    scope.isOpen = !scope.isOpen;
                }

                scope.searchOption = function(val) {
                    var _list = [];
                    var _reg = new RegExp(val, 'g');

                    for (var i = 0; i < _defaultResult.length; i++) {
                        if (_defaultResult[i].label.search(_reg) != -1) {
                            _list.push(_defaultResult[i]);
                        }
                    }
                    scope.results = _list;
                }


                scope.removeSelected = function(index, e) {
                    e.stopPropagation();
                    selectedDom[index].removeClass('result-selected');
                    selectedDom.splice(index, 1);
                    scope.currentOption.splice(index, 1);
                    changeFunctions();
                }

                function optionStatus(dom) {
                    var _result = false;
                    if (dom.hasClass('group-result') || dom.hasClass('result-selected')) {
                        _result = true;
                    }
                    return _result;
                }

                function setSelected(dom) {
                    var _selected,
                        _dom,
                        _val = dom.text();
                    dom.removeClass('highlighted');
                    if (attrs['isMulit']) {
                        _selected = scope.currentOption;
                        _dom = selectedDom;
                        selectedDom.push(dom);
                        _selected.push(_val);
                    } else {
                        _selected = _val;
                        if (selectedDom.length != 0) {
                            selectedDom[0].removeClass('highlighted');
                        }
                        selectedDom = [dom];
                    }
                    scope.currentOption = _selected;
                    changeFunctions();
                }

                function getSelectedValue() {
                    var _val = [];
                    for (var i = 0; i < selectedDom.length; i++) {
                        _val.push(selectedDom[i].attr('data-value'));
                    }
                    return _val;
                }

                function changeFunctions() {
                    var _cur = scope.currentOption;
                    if (angular.isFunction(scope.changeFunction)) {
                        if (!!ngModel) {
                            ngModel.$setViewValue(getSelectedValue());
                        }
                        scope.changeFunction(_cur, getSelectedValue());
                    }
                    scope.$emit('chosenChange', scope.currentOption, getSelectedValue());
                }

                function createDom() {
                    transcludeFn(scope, function(clone) {
                        var _results = [];
                        if (clone.length == 0) {
                            return;
                        }
                        for (var i = 0; i < clone.length; i++) {
                            if (clone[i].nodeType == 1) {
                                if (clone[i].tagName == 'OPTGROUP') {
                                    _results.push({
                                        label: clone[i].label,
                                        group: 'title'
                                    });
                                    if (clone[i].children.length > 0) {
                                        for (var j = clone[i].children.length - 1; j >= 0; j--) {
                                            _results.push({
                                                label: clone[i].children[j].label,
                                                group: 'option',
                                                value: clone[i].children[j].value
                                            });

                                        }
                                    }
                                } else {
                                    _results.push({
                                        label: clone[i].label,
                                        group: 'none',
                                        value: clone[i].value
                                    })
                                }
                            }
                        }
                        _defaultResult = _results;
                        scope.results = _results;
                        scope.currentOption = clone[1].label;
                    });
                }

                function setChosenSelected() {
                    if (scope.setSelected != undefined && scope.setSelected.length != 0) {
                        var _option = element[0].querySelectorAll('.chosen-results li');
                        var index = 0;
                        setFor:
                            for (var j = 0; j < scope.setSelected.length; j++) {
                                for (var i = 0; i < _option.length; i++) {
                                    if (angular.element(_option[i]).attr('data-value') == scope.setSelected[j]) {
                                        setSelected(angular.element(_option[i]));
                                        index++;
                                        break setFor;
                                    }
                                }
                            }
                        if (index <= 0) {
                            setSelected(angular.element(_option[0]));
                        }
                    }
                }

                function addWatch() {

                    var _body = angular.element(document.getElementsByTagName('body'));

                    scope.$watch('isOpen', function() {
                        for (var i = 0; i < selectedDom.length; i++) {
                            selectedDom[i].addClass(selectedClass);
                        }
                        if (scope.isOpen == true) {
                            $timeout(function() {
                                _body.bind('click', function(e) {
                                    var _parent = angular.element(e.target);
                                    for (var i = 0; i < 5; i++) {
                                        if (_parent.parent().length == 0) {
                                            break
                                        }
                                        if (element[0] == _parent.parent()[0]) {
                                            return false
                                        } else {
                                            _parent = _parent.parent();
                                        }
                                    }
                                    scope.$apply(function() {
                                        scope.isOpen = false;
                                    });
                                });
                            }, 10);
                        } else {
                            _body.unbind('click');
                        }
                    })

                    if (attrs['isMulit']) {
                        scope.currentOption = [];
                        selectedDom = [];
                        selectedClass = 'result-selected';
                        // scope.multiValue = '请选择一些选项';
                        scope.$watch('currentOption.length', function() {
                            if (scope.currentOption.length != 0) {
                                scope.multiValue = '';
                                scope.multiwidth = '25px';
                            } else {
                                scope.multiValue = '请选择一些选项';
                                scope.multiwidth = 'auto';
                            }
                        })
                    }

                    scope.$watch('setSelected', function() {
                        $timeout(setChosenSelected, 20);
                    })

                }

                function init() {
                    // console.log(scope.chosenData)
                    if (scope.chosenData != undefined) {
                        _defaultResult = scope.chosenData;
                        scope.results = scope.chosenData;
                        scope.currentOption = scope.chosenData[0].label;
                        scope.$watch('chosenData', function() {
                            _defaultResult = scope.chosenData;
                            scope.results = scope.chosenData;
                            scope.currentOption = scope.chosenData[0].label;
                        })
                    } else {
                        createDom();
                    }
                    addWatch();
                }

                init();
            };
        },
        replace: true
    };
})
