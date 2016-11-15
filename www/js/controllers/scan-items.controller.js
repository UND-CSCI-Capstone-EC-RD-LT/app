(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ScanItemsController', ['$rootScope', '$scope', '$state', '$q', '$timeout', '$ionicModal', 'Items', 'Departments', 'Buildings', 'Rooms', ScanItemsController]);

    function ScanItemsController($rootScope, $scope, $state, $q, $timeout, $ionicModal, Items, Departments, Buildings, Rooms) {
        var vm = this;

        //// GLOBALS ////

        // The edit user modal
        var scanSettingsModal = null;
        // The items modal
        var itemsModal = null;

        $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
            if(fromState.name == 'app.edit-item') {
                console.log(toParams);
                getRoomItemsApi(vm.scanSettings.room.id)
                    .then(function success(items) {
                        var itemId = fromParams.itemId;
                        refreshItemsList(items, itemId);
                        vm.showItems();
                    }).catch(function error() {
                        // error handling
                    });
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

        vm.setScanSettingDepartment = function() {
            // reset the building and room when new department is selected
            vm.scanSettings.building = null;
            vm.scanSettings.room = null;

            getDepartmentBuildingsApi(vm.scanSettings.department.id)
                .then(function success(buildings) {
                    vm.buildings = buildings;
                }).catch(function error() {
                    // error handling
                });
        }

        vm.setScanSettingBuilding = function(buildingIndex) {
            // reset the room when new building is selected
            vm.scanSettings.room = null;

            getBuildingRoomsApi(vm.scanSettings.building.id)
                .then(function success(rooms) {
                    vm.rooms = rooms;
                }).catch(function error() {
                    // error handling
                });
        }

        vm.showScanSettings = function() {
            if(!scanSettingsModal) {
                $ionicModal.fromTemplateUrl('templates/modals/scan-settings.html', {
                    scope: $scope,
                    animation: 'slide-in-up' // maybe use slide-in-down if it works on mobile
                }).then(function success(modal) {
                    scanSettingsModal = modal;
                    scanSettingsModal.show();
                });
            } else {
                scanSettingsModal.show();
            }
        };

        vm.hideScanSettings = function() {
            hideScanSettingsModal();
        };

        vm.newScan = function() {
            hideScanSettingsModal();
            onEnter();
        }

        vm.confirmScanSettings = function() {
            getRoomItemsApi(vm.scanSettings.room.id)
                .then(function success(items) {
                    vm.items.inRoom = items;
                    vm.scanSettingsSet = true;
                    vm.viewTitle = 'Scan Items';
                }).catch(function error() {
                    // error handling
                });
        };

        vm.showItems = function() {
            if(!itemsModal) {
                $ionicModal.fromTemplateUrl('templates/modals/items.html', {
                    scope: $scope,
                    animation: 'slide-in-up' // maybe use slide-in-down if it works on mobile
                }).then(function success(modal) {
                    itemsModal = modal;
                    itemsModal.show();
                });
            } else {
                itemsModal.show();
            }
        };

        vm.hideItems = function() {
            hideItemsModal();
        };

        vm.editItem = function(item) {
            hideItemsModal();
            $state.go('^.edit-item', {itemId: item.id});
        }

        vm.scanItem = function() {
            console.log('Scanning Item');
            var barcode = 12345;
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

        // Hides the edit user modal
        function hideScanSettingsModal() {
            if(scanSettingsModal){
                scanSettingsModal.hide();
            }
        }

        // Hides the edit user modal
        function hideItemsModal() {
            itemsModal.hide();
        }

        //// END MODAL FUNCTIONS ////

        function checkItem(barcode){
            var itemInRoom = false
            console.log(vm.items.inRoom);
            for(var i = 0; i < vm.items.inRoom.length; i++) {
                if(vm.items.inRoom[i].barcode == barcode) {
                    vm.items.inRoom[i].scanned = true;
                    itemInRoom = true;
                    break;
                }
            }
            return itemInRoom;
        }

        function refreshItemsList(items, checkItem) {
            var index = -1;
            for(var i = 0; i < items.length; i++) {
                if(items[i].id == checkItem) {
                    items[i].scanned = true;
                    vm.items.inRoom.push(items[i]);

                    index = indexOfItem(vm.items.inWrongRoom, items[i]);
                    if(index > -1) {
                        vm.items.inWrongRoom.splice(index,1);
                    }
                    break;
                }            
            }
        }

        function indexOfItem(array, item) {
            for (var i = 0; i < array.length; i++) {
                if(array[i].id === item.id) {
                    return i;
                }
            }
            return -1;
        }
    }
})();
