(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ScanItemsController', ['$rootScope', '$scope', '$state', '$q', '$timeout', '$ionicModal', 'Items', 'Departments', 'Buildings', 'Rooms', ScanItemsController]);

    function ScanItemsController($rootScope, $scope, $state, $q, $timeout, $ionicModal, Items, Departments, Buildings, Rooms) {
        var vm = this;

        //// GLOBALS ////

        // The edit user modal
        var editScanSettings = null;
        // The items modal
        var itemsModal = null;

        $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
            if(fromState.name == 'app.edit-item') {
                vm.showItems();
            }
        });

        // DEVELOPMENT ONLY
        // WAITING SO THE JWT TOKEN IS SET BEFORE CALLING
        $timeout(function() {
            onEnter();
        }, 1000);

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            console.log('ScanItemsController');
            vm.render = false;

            vm.viewTitle = 'Set Scan Settings';

            // for modal data
            vm.modal = {}

            vm.index = {
                department: null,
                building: null,
                room: null
            };

            vm.scanSettingsSet = false;

            vm.scanSettings = {
                department: null,
                building: null,
                room: null,
                scanType: 'Batch'
            };

            vm.items = {
                inRoom: [],
                inWrongRoom: [],
                newItems: []
            }

            vm.departments = [];
            vm.buildings = [];
            vm.rooms = [];
            
            vm.render = true;
            getData(isRefresh);
        }

        // Retrieves the data from the db
        function getData(isRefresh) {

            getRoomItemsApi(1)
                .then(function success(items) {
                    console.log(items);
                    vm.items.inRoom = items;
                }).catch(function error() {
                    // error handling
                });

            // getDepartmentsApi()
            //     .then(function success(departments) {
            //         console.log(departments);
            //         vm.departments = departments;
            //     }).catch(function error() {
            //         // error handling
            //     });

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

        function getRoomItemsApi(roomId) {
            return Rooms.getItems(roomId)
                .then(function success(items) {
                    return items;
                }).catch(function error(reason) {
                    //error handling
                    return $q.reject();
                });
        }

        function getItemBarcodeApi(barcode) {
            return Items.getItemBarcode(barcode)
                .then(function success(item) {
                    return item;
                }).catch(function error(reason) {
                    //error handling
                    return $q.reject();
                });
        }

        //// END API FUNCTIONS ////

        //// VIEW MODEL FUNCTIONS ////

        vm.setScanSettingDepartment = function(departmentIndex) {
            // setting department scan settings
            vm.scanSettings.department = vm.departments[departmentIndex];

            // reset the building and room when new department is selected
            vm.scanSettings.building = null;
            vm.index.building = null;
            vm.scanSettings.room = null;
            vm.index.room = null;

            getDepartmentBuildingsApi(vm.scanSettings.department.id)
                .then(function success(buildings) {
                    console.log(buildings);
                    vm.buildings = buildings;
                }).catch(function error() {
                    // error handling
                });
        }

        vm.setScanSettingBuilding = function(buildingIndex) {
            // setting building scan settings
            vm.scanSettings.building = vm.buildings[buildingIndex];

            // reset the room when new building is selected
            vm.scanSettings.room = null;
            vm.index.room = null;
            getBuildingRoomsApi(vm.scanSettings.building.id)
                .then(function success(rooms) {
                    console.log(rooms);
                    vm.rooms = rooms;
                }).catch(function error() {
                    // error handling
                });
        }

        vm.setScanSettingRoom = function(roomIndex) {
            // setting room scan settings
            vm.scanSettings.room = vm.rooms[roomIndex];
        }

        vm.editScanSettings = function() {
            if(!editScanSettings) {
                $ionicModal.fromTemplateUrl('templates/modals/scan-settings.html', {
                    scope: $scope,
                    animation: 'slide-in-up' // maybe use slide-in-down if it works on mobile
                }).then(function success(modal) {
                    editScanSettings = modal;

                    $scope.$on('modal.hidden', function() {
                        clearScanSettingsModalData();
                    });

                    addScanSettingsModalData()
                        // .then(function success() {
                            editScanSettings.show();
                        // });
                });
            } else {
                addScanSettingsModalData()
                    // .then(function success() {
                        editScanSettings.show();
                    // });
            }
        };

        // Cancel any edits made to the user info and close the modal
        vm.cancelEditScanSettings = function() {
            hideScanSettingsModal();
        };

        // Confirm any edits made to the scan settings and close the modal
        vm.confirmEditScanSettings = function(user) {
            // if(isValidEmail(user.email) && isValidCellNumber(user.cellNumber)) {
                // updateUserApi(user)
                //     .then(function success() {
                        hideScanSettingsModal();
                    // });
            // }
        };

        vm.newScan = function() {
            hideScanSettingsModal();
            onEnter();
            // vm.scanSettingsSet = false;
        }

        vm.confirmScanSettings = function() {
            console.log(vm.scanSettings);
            getRoomItemsApi(vm.scanSettings.room.id)
                .then(function success(items) {
                    console.log(items);
                    vm.items.inRoom = items;
                }).catch(function error() {
                    // error handling
                });
            vm.scanSettingsSet = true;
            vm.viewTitle = 'Scan Items';
        };

        vm.showItems = function() {
            if(!itemsModal) {
                $ionicModal.fromTemplateUrl('templates/modals/items.html', {
                    scope: $scope,
                    animation: 'slide-in-up' // maybe use slide-in-down if it works on mobile
                }).then(function success(modal) {
                    itemsModal = modal;

                    $scope.$on('modal.hidden', function() {
                        clearItemsModalData();
                    });

                    itemsModal.show();
                });
            } else {
                itemsModal.show();
            }
        };

        // Cancel any edits made to the user info and close the modal
        vm.hideItems = function() {
            hideItemsModal();
        };

        vm.editItem = function(item) {
            hideItemsModal();
            $state.go('^.edit-item', {itemId: item.id});
        }

        vm.scanItem = function() {
            console.log('Scanning Item');
            var barcode = 12348;
            if(!checkItem(barcode)) {
                console.log('Check if item exists');
                getItemBarcodeApi(barcode)
                    .then(function success(item) {
                        console.log(item);
                        if(item.barcode) {
                            vm.items.inWrongRoom.push(item);
                        } else {
                            vm.items.newItems.push({
                                barcode: barcode
                            })
                        }
                    }).catch(function error() {
                        // error handling
                    });
            }
        }

        //// END VIEW MODEL FUNCTIONS ////

        //// MODAL FUNCTIONS ////

        // Copies data to the edit user modal
        function addScanSettingsModalData() {
            angular.extend(vm.modal, {
                departments: [],
                buildings: [],
                rooms: []
            });

            // Retrieves the possible options
            for (var i = 0; i < 3; i++) {
                vm.modal.departments.push({
                    name: 'Department ' + (i+1)
                });
                vm.modal.buildings.push({
                    name: 'Building ' + (i+1)
                });
                vm.modal.rooms.push({
                    name: 'Room ' + (i+1)
                });
            }
        }

        // Clears the edit user modal data and resets its form
        function clearScanSettingsModalData() {

            // Necessary to apply the animations within $setUntouched, but wait for the next digest cycle
            $timeout(function() {
                $scope.$apply(vm.editScanSettingsForm.$setUntouched());
            });
            vm.modal = {};
        }

        // Hides the edit user modal
        function hideScanSettingsModal() {
            if(editScanSettings){
                editScanSettings.hide();
            }
            
        }

        // Clears the edit user modal data and resets its form
        function clearItemsModalData() {

        }

        // Hides the edit user modal
        function hideItemsModal() {
            itemsModal.hide();
        }

        //// END MODAL FUNCTIONS ////

        function checkItem(barcode){
            var itemInRoom = false
            console.log(vm.items.inRoom);
            for (var i = 0; i < vm.items.inRoom.length; i++) {
                if(vm.items.inRoom[i].barcode == barcode) {
                    vm.items.inRoom[i].scanned = true;
                    itemInRoom = true;
                    break;
                }
            }
            return itemInRoom;
        }
    }
})();
