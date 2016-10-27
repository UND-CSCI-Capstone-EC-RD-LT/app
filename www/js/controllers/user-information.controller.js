(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('UserInformationController', ['Users', UserInformationController]);

    function UserInformationController(Users) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter() {
            console.log('UserInformationController');
            vm.render = false;

            vm.render = true;
        }

        //// END INITIALIZATION FUNCTIONS ////
    }
})();
