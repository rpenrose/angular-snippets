(function () {
    membershipApp.directive('crDateTimePicker', ['$filter', function ($filter) {
        return {
            require: 'ngModel',
            restrict: 'AE',
            scope: {
                language: '@',
                useCurrent: '@',
                location: '@',
                internalDateTime: '@',
                pickTime: '@',
                futureDates: '@',
                minDate: '=',
                dateString: '=?'
            },

            link: function (scope, elem, attrs, ngModel) {

                var maxDate = function () {
                    if (scope.futureDates === 'true') {
                        var date = new Date();
                        date.setYear(date.getUTCFullYear() + 100);
                        return date;
                    }
                    return new Date();
                };

                var minDate = function () {
                    if (scope.minDate) {
                        return new Date(scope.minDate);
                    }
                    var date = new Date();
                    date.setYear(date.getUTCFullYear() - 100);
                    return date;
                };

                elem.datetimepicker({
                    language: scope.language,
                    useCurrent: scope.useCurrent === 'true',
                    pickTime: scope.pickTime === 'true',
                    maxDate: maxDate(),
                    minDate: minDate()
                }).on('dp.change', function (e) {
                    scope.internalDateTime = e.date._d;
                    if (scope.pickTime !== 'true' && scope.internalDateTime) {
                        scope.internalDateTime.setHours(0, 0, 0, 0);
                    }
                });

                function prefixWithZero(num) {
                    return  num < 10 ? '0' + num : '' + num;
                }

                function toInternationalDate(dt) {
                    return dt.getFullYear() + '-' + prefixWithZero((dt.getMonth() + 1)) + '-' + prefixWithZero(dt.getDate());
                }

                function onChange(date) {
                    if (!scope.internalDateTime) {
                        return '';
                    }
                    var dt = scope.internalDateTime;
                    var parsedDate = new Date(dt);
                    var iSoString = parsedDate.toISOString();
                    //return iSoString;
                    return toInternationalDate(parsedDate);
                }

                function onLoad(date) {
                    if (date) {
                        var parsedDate = new Date(date);
                        if (scope.pickTime === 'true') {
                            return $filter('date')(parsedDate, 'dd/MM/yyyy HH:mm');
                        }
                        var filteredDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                        return filteredDate;
                    }
                    return '';
                }

                ngModel.$parsers.push(onChange);
                ngModel.$formatters.push(onLoad);
            }
        };
    }]);
})();
