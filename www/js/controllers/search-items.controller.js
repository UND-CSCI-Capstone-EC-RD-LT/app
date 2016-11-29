(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('SearchItemsController', ['$state', '$q', '$timeout', 'Items', 'Departments', 'Buildings', 'Rooms', SearchItemsController]);

    function SearchItemsController($state, $q, $timeout, Items, Departments, Buildings, Rooms) {
        var vm = this;

        // DEVELOPMENT ONLY
        // WAITING SO THE JWT TOKEN IS SET BEFORE CALLING
        $timeout(function() {
            onEnter();
        }, 1000);

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            vm.render = false;

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
                    vm.departments = departments;
                }).catch(function error() {
                    // error handling
                });

        }

        //// END INITIALIZATION FUNCTIONS ////

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

        vm.setDepartment = function() {
            vm.search.building = null;
            vm.search.room = null;
            getDepartmentBuildingsApi(vm.search.department.id)
                .then(function success(buildings) {
                    vm.buildings = buildings;
                }).catch(function error() {
                    // error handling
                });
        };

        vm.setBuilding = function() {
            vm.search.room = null;
            getBuildingRoomsApi(vm.search.building.id)
                .then(function success(rooms) {
                    vm.rooms = rooms;
                }).catch(function error() {
                    // error handling
                });
        };

        vm.clearSearch = function() {
            onEnter();
        };

        vm.searchItems = function() {
            $state.go('.view-items', {
                departmentId: vm.search.department.id,
                buildingId: vm.search.building ? vm.search.building.id : 0,
                roomId: vm.search.room ? vm.search.room.id : 0
            });
        };

        //// END VIEW MODEL FUNCTIONS ////
    }
})();