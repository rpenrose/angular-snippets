
(function () {
    'use strict';

    var myApp = angular.module('rjp-date', []);

    myApp.constant("dataSet", {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        years: _.range(new Date().getFullYear(), new Date().getFullYear() - 116, -1),
        days: _.range(1, 32)
    });

    var isDateOfBirthComplete = function (dateOfBirth) {
        var isValidMonth = typeof dateOfBirth.month != 'undefined' && dateOfBirth.month.toString().length > 0;
        var isValidDay = typeof dateOfBirth.day != 'undefined' && dateOfBirth.day.toString().length > 0;
        var isValidYear = typeof dateOfBirth.year != 'undefined' && dateOfBirth.year.toString().length > 0;
        return isValidMonth && isValidDay && isValidYear;
    }

    var calculateAge = function (dob, asAt) {
        var age = asAt.getFullYear() - dob.getFullYear();
        var m = asAt.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && asAt.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    var dobIsValidForAgeLimits = function (dob, effectiveDate, minAge, maxAge) {
        if (minAge && maxAge) {
            var age = calculateAge(dob, effectiveDate);
            if (age < minAge || age > maxAge)
                return false;
        }
        return true;
    }
/*
	                <div name="dob" birth-date ng-model="player.Dob"
                     min-age="{{SelectedCamp.MinAge}}"
                     max-age="{{SelectedCamp.MaxAge}}"
                     effective-date="{{effectiveDate}}"
                     autocomplete="off" />
*/
    myApp.directive("birthDate", ['dataSet', function (dataSet) {
        return {
            // restrict to an attribute type.
            restrict: 'A',
            require: 'ngModel',
            scope: {
                theDate: '=ngModel',
                //date: {},
                //date: '=ngModel',
                minAge: '@',
                maxAge: '@',
                effectiveDate: '@',
                allowToday: '@'
                //setDate: '&'
            },
            link: function (scope, ele, attrs, ctrl) {

                ctrl.$setValidity('IncorrectAge', true);
                ctrl.$setValidity('CorrectAge', true);

                scope.allowToday = scope.allowToday == null ? false : scope.allowToday.toLowerCase()=='true';
                var dateM = moment();
                if (scope.theDate != null) {
                    dateM = moment(scope.theDate,"DD/MM/YYYY");
                }

                scope.date = {
                    year: dateM.year(),
                    month: dateM.format("MMM"),
                    day: dateM.date()
                };

                var dobEffectiveDate = new Date(Date.now());
                if (scope.effectiveDate) {
                    dobEffectiveDate = new Date(scope.effectiveDate);
                }
                function validate() {
                    scope.errorMessage = '';
                    ctrl.$setValidity('IncorrectAge', true);
                    ctrl.$setValidity('InComplete', true);
                    scope.theDate = null;

                    if (scope.date) {
                        var isComplete = isDateOfBirthComplete(scope.date);
                        ctrl.$setValidity('InComplete', isComplete);

                        if (isComplete) {
                            var month = dataSet.months.indexOf(scope.date.month);
                            var dob = new Date(scope.date.year, month, scope.date.day);
                            if (!isNaN(dob)) {
                                var isCorrectAge = dobIsValidForAgeLimits(dob, dobEffectiveDate, Number(scope.minAge), Number(scope.maxAge));
                                ctrl.$setValidity('IncorrectAge', isCorrectAge);
                                if (isCorrectAge) {
                                    //scope.setDate(dob);
                                    scope.theDate = dob;
                                } else {
                                    scope.errorMessage = 'Camp age range: ' + scope.minAge + ' to ' + scope.maxAge;
                                }

                            } else {
                                ctrl.$setValidity('InComplete', false);
                            }
                        } else {
                            ctrl.$setValidity('InComplete', false);
                        }

                    } else {
                        ctrl.$setValidity('InComplete', false);
                    }
                }


                scope.$watch(function () {
                    var date = scope.date;
                    var str =
                        date ?
                            ((date.day ? date.day : '') + '-' +
                            (date.month ? date.month : '') + '-' +
                            (date.year ? date.year : '')) : '';
                    return str;
                }, function (newVal, oldVal) {
                    validate();
                });

                scope.dataSet = dataSet;

            },
            template:
            "<div></div><div class=\"row nopadding\" >" +
            "<div class='col-md-4 nopadding'>" +
            " <select ng-model='date.day' required name='dayOfBirth' class=\"form-control\" data-ng-options='day as day for day in dataSet.days'> " +
            "  <option value='' selected=''>Day</option> " +
            " </select></div> " +
            "<div class='col-md-4 nopadding'>" +
            "<select ng-model='date.month' required name='monthOfBirth' class=\"form-control\" data-ng-options='month as month for month in dataSet.months'>" +
            "  <option value='' selected=''>Month</option> " +
            " </select></div>" +
            "<div class='col-md-4 nopadding'>" +
            " <select ng-model='date.year'' required name='yearOfBirth'' class=\"form-control\" data-ng-options='year as year for year in dataSet.years'> " +
            " <option value='' selected=''>Year</option> " +
            " </select></div>" + "<small ng-show='errorMessage.length >0' class='field-validation-error'>{{errorMessage}}</small></div> "
        }
    }]);

}());