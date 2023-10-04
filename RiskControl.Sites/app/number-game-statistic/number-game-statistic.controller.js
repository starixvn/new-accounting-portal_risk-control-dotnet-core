(function (angular) {
    'use strict';

    angular
        .module('app.numberGameStatisticApp')
        .controller('NumberGameStatisticController', NumberGameStatisticController);

    NumberGameStatisticController.$inject = [];
    function NumberGameStatisticController() {
        var vm = this;
        vm.panes = [];
    }
})(angular);