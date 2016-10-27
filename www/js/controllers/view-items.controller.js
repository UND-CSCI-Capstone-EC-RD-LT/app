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

            vm.render = true;

        }

        //// END INITIALIZATION FUNCTIONS ////
    }
})();
