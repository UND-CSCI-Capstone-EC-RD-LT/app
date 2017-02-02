(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('AppController', ['$state', 'API', AppController]);

    function AppController($state, API) {
        var vm = this;

        API.setToken();

        vm.logout = function() {
        	API.removeToken();
        	$state.go('login');
        }
    }
})();

