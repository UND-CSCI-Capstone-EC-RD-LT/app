(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('EditItemController', ['Items', 'Departments', 'Buildings', 'Rooms', EditItemController]);

    function EditItemController(Items, Departments, Buildings, Rooms) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter() {
            console.log('EditItemController');
            vm.render = false;

            vm.render = true;
        }

        //// END INITIALIZATION FUNCTIONS ////
    }
})();
