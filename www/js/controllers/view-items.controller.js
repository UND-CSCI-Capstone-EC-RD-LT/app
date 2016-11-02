(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ViewItemsController', ['$q', '$timeout', 'Items', 'Departments', 'Buildings', 'Rooms', ViewItemsController]);

    function ViewItemsController($q, $timeout, Items, Departments, Buildings, Rooms) {
        var vm = this;

        // DEVELOPMENT ONLY
        // WAITING SO THE JWT TOKEN IS SET BEFORE CALLING
        $timeout(function() {
            onEnter();
        }, 1000);

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            console.log('ViewItemsController');
            vm.render = false;

            vm.accordion = {
                isOpen: false
            };

            vm.render = true;

        }

        // Retrieves the data from the db
        function getData(isRefresh) {


        }

        //// END INITIALIZATION FUNCTIONS ////

        // Opens an organization accordion
        vm.toggleItemTypeOpen = function() {
            vm.accordion.isOpen = !vm.accordion.isOpen;
        };

        //// API FUNCTIONS ////

        //// END API FUNCTIONS ////

        //// VIEW MODEL FUNCTIONS ////


        //// END VIEW MODEL FUNCTIONS ////
    }
})();
