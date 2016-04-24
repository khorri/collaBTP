app.directive('spinner', ['$rootScope', '$state', function ($rootScope, $state) {
	return {
		restrict: 'E',
		template: "<h1 ng-if='isRouteLoading' class='loader-small'>Chargement <i class='fa fa-circle-o-notch fa-spin'></i></h1>",
		link: function (scope, elem, attrs) {
			scope.isRouteLoading = true;

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				if (toState.name != 'project.missions.facturation' && toState.name != 'project.missions.voir' && toState.name != 'project.missions.invoicelist' && toState.name != 'project.fieldVisit.attachedFiles')
					scope.isRouteLoading = true;
			});

			$rootScope.$on('$stateChangeSuccess', function () {
				scope.isRouteLoading = false;
			});
		}
	}
}]);

app.directive('friendList', ['$sails', 'userService', 'notificationService', '$filter', '$window', function ($sails, userService, notificationService, $filter, $window) {
	return {
		restrict: 'E',
		templateUrl: "app/partials/friendlist.html",
		link: function (scope, elem, attrs) {
			//$sails.get("/user/subscribe");

			userService.getAll();
			scope.users = userService.users;

			$sails.on("user", function (message) {
				if (message.verb == 'updated') {
					userService.getAll();
					if (message.id == userService.loggedUser.id && !message.data.loggedIn) {
						$window.location.href = '/index';
					}
				}
			});
			$sails.on("userLogin", function (userID) {
				userService.subscribe(userID);
				userService.getAll();
			});

			$sails.on("userLogout", function (message) {
				userService.getAll();
			});
		}
	}
}]);


app.directive('messageBadge', ['$sails', 'messageService', '$filter', function ($sails, messageService, $filter) {
	return {
		restrict: 'AE',
		template: '<span ng-show="newMessages.length	 > 0" class="badge">{{newMessages.length}}</span>',
		link: function (scope, elem, attrs) {
			messageService.getNew();
			scope.newMessages = messageService.new;

			$sails.on('user', function (m) {
				messageService.getNew();
			});
		}
	}
}]);

app.directive('csSelect', function () {
	return {
		require: '^stTable',
		template: '<input ng-disabled="row.bill" type="checkbox"/>',
		scope: {
			row: '=csSelect'
		},
		link: function (scope, element, attr, ctrl) {

			element.bind('change', function (evt) {
				scope.$apply(function () {
					ctrl.select(scope.row, 'multiple');
				});
			});

			scope.$watch('row.isSelected', function (newValue, oldValue) {
				if (newValue === true) {
					element.parent().addClass('st-selected');
					scope.$emit('checkBoxChecked');
				} else {
					element.parent().removeClass('st-selected');
					scope.$emit('checkBoxChecked');
				}
			});
		}
	};
});

app.directive('csSelectDocexam', function () {
	return {
		require: '^stTable',
		template: '<input class="no-validation" type="checkbox" ng-model="row.selected" /> ',
		scope: {
			row: '=csSelectDocexam'
		},
		link: function (scope, element, attr, ctrl) {

			element.bind('change', function (evt) {
				scope.$apply(function () {
					ctrl.select(scope.row, 'multiple');
				});
			});

			scope.$watch('row.isSelected', function (newValue, oldValue) {
				if (newValue === true) {
					element.parent().addClass('st-selected');
					scope.$emit('checkBoxChecked');
				} else {
					element.parent().removeClass('st-selected');
					scope.$emit('checkBoxChecked');
				}
			});
		}
	};
});


app.directive('notempty', [function () {
	return {
		require: 'ngModel',
		link: function (scope, ele, attrs, c) {
			scope.$watch(attrs.ngModel, function (newVal) {
				if (newVal && newVal.length > 0) {
					c.$setValidity('notempty', true);
					return true;
				} else {
					c.$setValidity('notempty', false);
					return false;
				}
			});
		}
	}
}]);

function isEmpty(value) {
	return angular.isUndefined(value) || value === '' || value === null || value !== value;
}


app.directive('ngMin', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMin, function () {
				ctrl.$setViewValue(ctrl.$viewValue);
			});
			var minValidator = function (value) {
				var min = scope.$eval(attr.ngMin) || 0;
				if (!isEmpty(value) && value < min) {
					ctrl.$setValidity('ngMin', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMin', true);
					return value;
				}
			};

			ctrl.$parsers.push(minValidator);
			ctrl.$formatters.push(minValidator);
		}
	};
});

app.directive('ngMax', [function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMax, function () {
				ctrl.$setViewValue(ctrl.$viewValue);
			});
			var maxValidator = function (value) {
				var max = scope.$eval(attr.ngMax) || Infinity;
				if (!isEmpty(value) && value > max) {
					ctrl.$setValidity('ngMax', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMax', true);
					return value;
				}
			};

			ctrl.$parsers.push(maxValidator);
			ctrl.$formatters.push(maxValidator);
		}
	};
}]);

app.directive('ngEnter', [function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
}]);

app.directive('ngEsc', [function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if (event.which === 27) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEsc);
				});

				event.preventDefault();
			}
		});
	};
}]);

app.directive('fileType', [function () {
	return {
		restrict: 'AE',
		template: '<i class="fa fa-5x" ng-class="type"></i>',
		link: function (scope, elem, attrs) {
			if (attrs.type.indexOf("image") > -1) {
				scope.type = 'fa-file-image-o';
			} else if (attrs.type.indexOf("pdf") > -1) {
				scope.type = 'fa-file-pdf-o';
			} else if (attrs.type.indexOf("audio") > -1) {
				scope.type = 'fa-file-audio-o';
			} else if (attrs.type.indexOf("sheet") > -1) {
				scope.type = 'fa-file-excel-o';
			} else if (attrs.type.indexOf("word") > -1) {
				scope.type = 'fa-file-word-o';
			} else if (attrs.type.indexOf("video") > -1) {
				scope.type = 'fa-file-video-o';
			} else if(attrs.type.indexOf("powerpoint") > -1 || attrs.type.indexOf("presentation") > -1){
				scope.type = 'fa-file-powerpoint-o';
			} else {
                scope.type = 'fa-file';
            }


		}
	}
}]);

app.directive('fileTypeBis', [function () {
    return {
        restrict: 'AE',
        templateUrl: "app/partials/fileTypeBis.html",
        link: function (scope, elem, attrs) {
            scope.image = false;
            scope.video = false;
            if (attrs.type.indexOf("image") > -1) {
                scope.type = 'fa-file-image-o';
                scope.image = true;
                scope.source = attrs.src;
            } else if (attrs.type.indexOf("pdf") > -1) {
                scope.type = 'fa-file-pdf-o';
            } else if (attrs.type.indexOf("audio") > -1) {
                scope.type = 'fa-file-audio-o';
            } else if (attrs.type.indexOf("sheet") > -1) {
                scope.type = 'fa-file-excel-o';
            } else if (attrs.type.indexOf("word") > -1) {
                scope.type = 'fa-file-word-o';
            } else if (attrs.type.indexOf("video") > -1) {
                scope.type = 'fa-file-video-o';
                scope.video = true;
                scope.source = attrs.src;
            } else if(attrs.type.indexOf("powerpoint") > -1 || attrs.type.indexOf("presentation") > -1){
                scope.type = 'fa-file-powerpoint-o';
            }else {
                scope.type = 'fa-file';
            }

        }
    }
}]);

app.directive('fileIcon', ['$compile', function ($compile) {
    return {
        restrict: 'AE',
        scope: {
          file :'='
        },
        /*template: '<i class="fa" ng-class="type"></i>',*/
        link: function (scope, elem, attrs) {
            var template =  '<i class="fa" ng-class="type"></i>';
            var content = $compile(template)(scope);
            var iconSize = (scope.iconSize)? scope.iconSize : '';

           iconSize = (attrs.size)? attrs.size : '';
            if (attrs.type.indexOf("image") > -1) {
                scope.type = 'fa-file-image-o '+iconSize;
            } else if (attrs.type.indexOf("pdf") > -1) {
                scope.type = 'fa-file-pdf-o '+iconSize;
            } else if (attrs.type.indexOf("audio") > -1) {
                scope.type = 'fa-file-audio-o '+iconSize;
            } else if (attrs.type.indexOf("sheet") > -1) {
                scope.type = 'fa-file-excel-o '+iconSize;
            } else if (attrs.type.indexOf("word") > -1) {
                scope.type = 'fa-file-word-o '+iconSize;
            } else if (attrs.type.indexOf("video") > -1) {
                scope.type = 'fa-file-video-o '+iconSize;
            } else if(attrs.type.indexOf("powerpoint") > -1 || attrs.type.indexOf("presentation") > -1) {
                scope.type = 'fa-file-powerpoint-o ' + iconSize;
            } else if(attrs.type.indexOf("text") > -1 || attrs.type.indexOf("xml") > -1 || attrs.type.indexOf("json") > -1){
                    scope.type = 'fa-file-text '+iconSize;
            } else {
                scope.type = 'fa-file '+iconSize;
            }
            if(scope.file && scope.file.size>0) {
                //scope.link= attrs.link;
                var aElement = $compile('<a href="{{file.webPath}}"></a>')(scope);
                elem.append(content);
                elem.after(aElement);
                aElement.prepend(elem);
            }else{
                elem.append(content);
            }


        }
    }
}]);

app.directive('statsCard',[function(){
    return {
        restrict: 'AE',
        templateUrl: "app/partials/statistics/stats-card.html",
        link:function(scope, elem, attrs){
            scope.value = attrs.value;
            scope.text = attrs.text;
            scope.icon = attrs.icon;
        }
    }
}])
app.directive("sparkline", ['$parse',function($parse) {
    return {
        restrict: "EA",
        link: function(scope, el, attrs) {

            var model = attrs.values || el.text();
            var opts = {};

            if(attrs.opts) angular.extend(opts, angular.fromJson(attrs.opts));
            else {
                angular.extend(opts, attrs);
            }

            var project = scope.$eval(attrs.model);
            // The following options have to be converted to array from string
            // Type 		Options
            // ====			========
            // Bar 			stackedBarColor
            // Bullet		rangeColors
            // Pie 			sliceColors
            // NOte: when sepcifying multiple colors for above attributes, don't put spaces between them
            // Eg: [#4CAF50,#38B4EE,#eee]  // right
            // 	[#4CAF50, #38B4EE, #eee]	// wrong

            // for bar
            if(attrs.stackedBarColor) {
                opts.stackedBarColor = attrs.stackedBarColor.replace("[", "").replace("]", "").split(",");
            }
            // for bullet
            if(attrs.rangeColors) {
                opts.rangeColors = attrs.rangeColors.replace("[", "").replace("]", "").split(",");
            }
            // for pie
            if(attrs.sliceColors) {
                opts.sliceColors =(function(){
                    var start = moment(project.starts);
                    var end = (project.ends)?moment(project.ends):project.ends;
                    var diffByDays=  moment().diff(start,'days');
                    var duration = (project.ends)? end.diff(start,'days'):20;
                    var percent = (diffByDays/parseFloat(duration));
                    percent = (percent<0)? 0 : percent;
                    percent = (percent>1)? 1 : percent;
                    var rgb = "rgb(" + Math.round(255 * percent) + ", " + Math.round(255 * (1-percent)) + ", 0)";
                    var hex = rgb2hex(rgb);
                    hex = (hex)?hex:"#4CAF50";
                    return [hex,"#EEE"];
                }());
                // attrs.sliceColors.replace("[", "").replace("]", "").split(",");

            }

            var invoker = $parse(attrs.sparkline);
             model = invoker(scope, {param: project});


            if(angular.isString(model)){
                model = JSON.parse("[" + model + "]");

            }

            el.sparkline(model, opts);

        }
    }
}]);

app.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}])

var hexDigits = new Array
("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

/*app.directive('inputDatePicker',[function(){
    return {
        restrict: 'A',
        scope: {
            inputDatePicker: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('inputDatePicker', function (v) {
                console.log('value changed, new value is: ' + v);
            });
        }
    };
}]);*/

