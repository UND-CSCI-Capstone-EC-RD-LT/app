(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('EditItemController', ['$stateParams', '$q', 'Items', 'Departments', 'Buildings', 'Rooms', EditItemController]);

    function EditItemController($stateParams, $q, Items, Departments, Buildings, Rooms) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            console.log('EditItemController');
            vm.render = false;

            vm.item = {
                id: $stateParams.itemId
            };

            getData(isRefresh)
            vm.render = true;
        }

        // Retrieves the data from the db
        function getData(isRefresh) {
            getItemApi(vm.item.id)
                .then(function success(item) {
                    console.log(item);
                    vm.item = item;
                    // vm.items.inRoom = items;
                }).catch(function error() {
                    // error handling
                });

        }

        //// END INITIALIZATION FUNCTIONS ////

        //// API FUNCTIONS ////

        function getItemApi(itemId) {
            return Items.getItem(itemId)
                .then(function success(item) {
                    return item;
                }).catch(function error(reason) {
                    //error handling
                    return $q.reject();
                });
        }

        //// END API FUNCTIONS ////
    }
})();
