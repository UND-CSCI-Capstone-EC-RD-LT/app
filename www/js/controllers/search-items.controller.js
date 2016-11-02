(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('SearchItemsController', ['$q', 'Items', 'Departments', 'Buildings', 'Rooms', SearchItemsController]);

    function SearchItemsController($q, Items, Departments, Buildings, Rooms) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            console.log('ViewItemsController');
            vm.render = false;

            vm.accordion = {
                isOpen: false
            };

            vm.departments = null;
            vm.buildings = null;
            vm.rooms = null;

            vm.search = {
                department: null,
                building: null,
                room: null
            }

            getData(isRefresh);

            vm.render = true;

        }

        // Retrieves the data from the db
        function getData(isRefresh) {

            getDepartmentsApi()
                .then(function success(departments) {
                    console.log(departments);
                    vm.departments = departments;
                }).catch(function error() {
                    // error handling
                });

        }

        //// END INITIALIZATION FUNCTIONS ////

        // Opens an organization accordion
        vm.toggleItemTypeOpen = function() {
            vm.accordion.isOpen = !vm.accordion.isOpen;
        };

        //// API FUNCTIONS ////

        function getDepartmentsApi() {
            return Departments.getDepartments()
                .then(function success(departments) {
                    return departments;
                }).catch(function error(reason) {
                    //error handling
                    return $q.reject();
                });
        }

        function getDepartmentBuildingsApi(departmentId) {
            return Buildings.getDepartmentBuildings(departmentId)
                .then(function success(buildings) {
                    return buildings;
                }).catch(function error(reason) {
                    //error handling
                    return $q.reject();
                });
        }

        function getBuildingRoomsApi(buildingId) {
            return Rooms.getBuildingRooms(buildingId)
                .then(function success(rooms) {
                    return rooms;
                }).catch(function error(reason) {
                    //error handling
                    return $q.reject();
                });
        }

        //// END API FUNCTIONS ////

        //// VIEW MODEL FUNCTIONS ////

        vm.getDepartmentBuildings = function(departmentId) {
            getDepartmentBuildingsApi(departmentId)
                .then(function success(buildings) {
                    console.log(buildings);
                    vm.buildings = buildings;
                }).catch(function error() {
                    // error handling
                });
        }

        vm.getBuildingRooms = function(buildingId) {
            getBuildingRoomsApi(buildingId)
                .then(function success(rooms) {
                    console.log(rooms);
                    vm.rooms = rooms;
                }).catch(function error() {
                    // error handling
                });
        }

        //// END VIEW MODEL FUNCTIONS ////
    }
})();
