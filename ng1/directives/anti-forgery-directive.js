(function() {
    'use strict';

    var myApp = angular.module('rjp-anti-forgery', []);

    myApp.directive('rjpRequestVerificationToken', ['$http', function ($http) {
        //    return function (scope, element, attrs) {
        //       $http.defaults.headers.common['__RequestVerificationToken'] = attrs.ncgRequestVerificationToken || "no request verification token";
        //    };
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            $http.defaults.headers.common['__RequestVerificationToken'] = attrs.rjpRequestVerificationToken || "no request verification token";
        }
    }]);

})();

