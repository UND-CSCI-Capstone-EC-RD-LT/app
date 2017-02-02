(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ErrorController', ['$stateParams', '$state', 'API', ErrorController]);

    function ErrorController($stateParams, $state, API) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter() {
            vm.render = false;

            vm.reason = $stateParams.reason;

            vm.render = true;
        }

        //// END INITIALIZATION FUNCTIONS ////

        vm.returnLogin = function() {
            API.removeToken();
            $state.go('login');
        }
    }
})();
