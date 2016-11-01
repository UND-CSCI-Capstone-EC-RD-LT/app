(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ViewItemsController', ['Items', 'Departments', 'Buildings', 'Rooms', ViewItemsController]);

    function ViewItemsController(Items, Departments, Buildings, Rooms) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter() {
            console.log('ViewItemsController');
            vm.render = false;

            vm.accordion = {
                isOpen: false
            }

            vm.search = {
                department: null,
                building: null,
                room: null
            }

            vm.render = true;

        }

        //// END INITIALIZATION FUNCTIONS ////

        // Opens an organization accordion
        vm.toggleItemTypeOpen = function() {
            vm.accordion.isOpen = !vm.accordion.isOpen;
        };
    }
})();
