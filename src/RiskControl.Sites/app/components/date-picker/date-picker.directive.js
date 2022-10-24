(function (angular) {
    'use strict';

    angular
        .module('app.core')
        .directive('napDatePicker', napDatePicker);

    function napDatePicker() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/date-picker/date-picker.directive.html',
            scope: {
                ngModel: '='
            },
            replace: true,
            controller: controller,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;
    }

    controller.$inject = ['$scope', '$element', '$document', 'moment', 'config'];
    function controller($scope, $element, $document, moment, config) {
        var vm = this;
        var selectedDate;
        var minDate = moment.utc([2011, 0, 1]);
        var maxDate = moment.utc(config.yesterday);
        var startOfMonthOfMinDate = moment.utc(minDate).startOf('month');
        var endOfMonthOfMaxDate = moment.utc(maxDate).endOf('month');

        vm.openCalendar = function () {
            vm.isOpen = true;
            $document.unbind('click', documentClickBind);
            $document.bind('click', documentClickBind);
        };

        vm.goPreviousMonth = function () {
            if (vm.previousDisabled) {
                return;
            }
            selectedDate = vm.previousMonth;
            correctSelectedDate();
            generateViewModel();
        };

        vm.goNextMonth = function () {
            if (vm.nextDisabled) {
                return;
            }
            selectedDate = vm.nextMonth;
            correctSelectedDate();
            generateViewModel();
        };

        vm.changeMonth = function () {
            selectedDate.month(vm.month.value);
            correctSelectedDate();
            generateViewModel();
        };

        vm.changeYear = function () {
            selectedDate.year(vm.year);
            correctSelectedDate();
            generateViewModel();
        };

        vm.changeDate = function (date) {
            if (date.disabled) {
                return;
            }

            selectedDate = date.value;
            generateViewModel();
            vm.text = selectedDate.format('MMM DD, YYYY');
            vm.ngModel = moment.utc(selectedDate);
        };

        $scope.$on('$destroy', function () {
            $document.unbind('click', documentClickBind);
        });

        $scope.$watch('vm.ngModel', function () {
            init();
        });

        function init() {
            selectedDate = moment(vm.ngModel);
            vm.isOpen = false;
            vm.text = selectedDate.format('MMM DD, YYYY');
            generateViewModel();
        }

        function correctSelectedDate() {
            if (selectedDate.isBefore(minDate)) {
                selectedDate = moment(minDate);
            } else if (selectedDate.isAfter(maxDate)) {
                selectedDate = moment(maxDate);
            }
        }

        function generateViewModel() {
            var selectedMonth = selectedDate.month();
            var selectedYear = selectedDate.year();
            var startOfMonth = moment.utc(selectedDate).startOf('month');
            var endOfMonth = moment.utc(selectedDate).endOf('month');
            var startDate = moment.utc(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');

            vm.monthOptions = generateMonthOptions();
            vm.month = vm.monthOptions[0];
            angular.forEach(vm.monthOptions, function (monthOption) {
                if (monthOption.value === selectedMonth) {
                    vm.month = monthOption;
                }
            });
            vm.yearOptions = generateYearOptions();
            vm.year = selectedDate.year();
            vm.dayHeaders = vm.dayHeaders || generateDayHeaders();
            vm.weeks = generateWeeks();

            var previousMonth = moment(selectedDate).subtract(1, 'months');
            vm.previousDisabled = previousMonth.isBefore(startOfMonthOfMinDate);
            if (!vm.previousDisabled) {
                vm.previousMonth = previousMonth;
            }

            var nextMonth = moment(selectedDate).add(1, 'months');
            vm.nextDisabled = nextMonth.isAfter(endOfMonthOfMaxDate);
            if (!vm.nextDisabled) {
                vm.nextMonth = nextMonth;
            }

            function generateMonthOptions() {
                var monthShortNames = moment.monthsShort();
                var monthOptions = [];
                var date = moment(selectedDate);
                for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                    date.month(monthNumber);
                    if (date.isBefore(startOfMonthOfMinDate) || date.isAfter(endOfMonthOfMaxDate)) {
                        continue;
                    }

                    monthOptions.push({
                        name: monthShortNames[monthNumber],
                        value: monthNumber
                    });
                }

                return monthOptions;
            }

            function generateYearOptions() {
                var yearOptions = [];
                var beginYear = minDate.year();
                var endYear = maxDate.year();
                for (var yearNumber = beginYear; yearNumber <= endYear; yearNumber++) {
                    yearOptions.push(yearNumber);
                }

                return yearOptions;
            }

            function generateDayHeaders() {
                var dayShortNames = moment.weekdaysMin();
                var dayFullNames = moment.weekdays();
                var dayHeaders = [];
                for (var dayNumber = 0; dayNumber < 7; dayNumber++) {
                    var shortName = dayShortNames[dayNumber];
                    var fullName = dayFullNames[dayNumber];
                    var weekend = dayNumber === 0 || dayNumber === 6;
                    dayHeaders.push({
                        name: shortName,
                        title: fullName,
                        weekend: weekend
                    });
                }

                return dayHeaders;
            }

            function generateWeeks() {
                var weeks = [];
                for (var i = 0; i < 6; i++) {
                    var week = {
                        dates: []
                    };
                    for (var j = 0; j < 7; j++) {
                        var monthMoment = moment.utc(startDate).add(i * 7 + j, 'days');
                        var date = {
                            value: monthMoment,
                            text: monthMoment.format('D'),
                            active: monthMoment.format('YYYY-MMM-DD') === selectedDate.format('YYYY-MMM-DD'),
                            past: monthMoment.isBefore(startOfMonth),
                            future: monthMoment.isAfter(endOfMonth),
                            disabled: monthMoment.isBefore(minDate) || monthMoment.isAfter(maxDate)
                        };
                        week.dates.push(date);
                    }
                    weeks.push(week);
                }

                return weeks;
            }
        }

        function documentClickBind(event) {
            if (!vm.isOpen) {
                $document.unbind('click', documentClickBind);
                return;
            }

            var dpContainsTarget = $element[0].contains(event.target);
            if (vm.isOpen && !dpContainsTarget) {
                $scope.$apply(function () {
                    vm.isOpen = false;
                });
            }
        }
    }
})(angular);