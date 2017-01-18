(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('AppController', ['$rootScope', '$state', 'API', AppController]);

    function AppController($rootScope, $state, API) {
        var vm = this;

        API.setToken();

        vm.logout = function() {
        	API.removeToken();
        	$state.go('login');
        }
    }
})();

