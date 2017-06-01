/*
        NotSpecified = 0,
        Pending = 1,
        Active = 2,
        InActive = 3

*/

// Original
(function () {
    membershipApp.directive('memberStatus', function () {

        function applyClass(scope, el, attrs)
        {
            var _status = scope.model;
            var _classVal = '';
            var _name = 'unknown';

            switch (_status) {
                case 2:
                    _classVal = 'label label-success';
                    _name = 'Active';
                    break;
                case 3:
                    _classVal = 'label label-danger';
                    _name = 'In Active';
                    break;
                case 1:
                    _classVal = 'label label-default';
                    _name = 'Pending';
                    break;
                case 5:
                    _classVal = 'label label-default';
                    _name = 'Try Out';
                    break;
                case 4:
                    _classVal = 'label label-warning';
                    _name = 'Active Previous Season';
                    break;
                case 6:
                    _classVal = 'label label-default';
                    _name = 'Waiting List';
                    break;
            }

            $(el).removeClass('label');
            $(el).removeClass('label-success');
            $(el).removeClass('label-danger');
            $(el).removeClass('label-warning');
            $(el).removeClass('label-default');
            $(el).addClass(_classVal);
            $(el).text(_name);
        }

        return {
            restrict: 'AE',
            require: 'ngModel',
            template: '',
            scope: {
                options: '=',
                model: '=ngModel'
            },
            link: function (scope, el, attrs) {

                applyClass(scope, el, attrs);

                scope.$watch("model", function () {
                    /*console.log("Changed = " + scope.model);*/
                    applyClass(scope, el, attrs);
                });

            }
        };
    });
})();