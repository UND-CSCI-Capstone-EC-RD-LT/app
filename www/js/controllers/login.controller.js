(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('LoginController', ['$rootScope', '$state', '$q', 'API', LoginController]);

    function LoginController($rootScope, $state, $q, API) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            console.log('Login Controller');
            vm.render = false;

            vm.hideRememberMe = true;

            vm.email = '';
            vm.password = '';

            vm.isIncorrect = false;

            vm.render = true;
        }

        //// END INITIALIZATION FUNCTIONS ////

        //// API FUNCTIONS ////

        function loginApi(email, password) {
            return API.login(email, password)
                .catch(function(reason) {
                    //error handling
                    if(reason.origErr.data.code === API.errorTypes.E_USER_NOT_FOUND) {
                        vm.isIncorrect = true;
                        vm.errorMessage = reason.origErr.data.message;
                        return $q.reject();
                    }
                });
        }

        //// END API FUNCTIONS ////

        //// VIEW MODEL FUNCTIONS ////

        vm.login = function() {
            // Clear the password from the view
            var password = vm.password;
            vm.password = '';

            return loginApi(vm.email, password)
                .then(function success(res) {
                    $rootScope.user = {
                        email: vm.email
                    };
                    vm.email = '';
                    $state.go('app.scan-items');
                });
        }

        vm.clearIsIncorrect = function() {
            vm.isIncorrect = false;
        }

        //// END VIEW MODEL FUNCTIONS ////
    }
})();
