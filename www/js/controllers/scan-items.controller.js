(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ScanItemsController', ['$rootScope', '$scope', '$window', '$state', '$q', '$timeout', '$ionicModal', 'Items', 'Departments', 'Buildings', 'Rooms', ScanItemsController]);

    function ScanItemsController($rootScope, $scope, $window, $state, $q, $timeout, $ionicModal, Items, Departments, Buildings, Rooms) {
        var vm = this;

        //// GLOBALS ////

        // The edit user modal
        var scanSettingsModal = null;
        // The items modal
        var itemsModal = null;

        // Returning to scan state from edit state and refreshing item list for changes
        $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
            if(fromState.name == 'app.edit-item') {
                getRoomItemsApi(vm.scanSettings.room.id)
                    .then(function success(items) {
                        var itemId = fromParams.itemId;
                        refreshItemsList(items, itemId);
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

            vm.barcode = null;

            vm.scanSettings = {
                department: null,
                building: null,
                room: null,
                scanType: 'Batch',
                set: false
            };

            vm.items = {
                inRoom: [],
                inWrongRoom: [],
                newItems: []
            };

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

        function createItemApi(item) {
            return Items.createItem(item)
                .then(function success(item) {
                    return item;
                })
                .catch(function error(reason) {
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
        };

        vm.setScanSettingBuilding = function(buildingIndex) {
            // reset the room when new building is selected
            vm.scanSettings.room = null;

            getBuildingRoomsApi(vm.scanSettings.building.id)
                .then(function success(rooms) {
                    vm.rooms = rooms;
                }).catch(function error() {
                    // error handling
                });
        };

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
        };

        vm.confirmScanSettings = function() {
            getRoomItemsApi(vm.scanSettings.room.id)
                .then(function success(items) {
                    vm.items.inRoom = items;
                    vm.scanSettings.set = true;
                    vm.viewTitle = 'Scan Items';
                }).catch(function error() {
                    // error handling
                });
        };

        vm.startScan = function(){
            startScan();
        };

        vm.editItem = function(item) {
            $state.go('^.edit-item', {itemId: item.id});
        };

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
            var itemInRoom = false;
            for(var i = 0; i < vm.items.inRoom.length; i++) {
                if(vm.items.inRoom[i].barcode == barcode) {
                    vm.items.inRoom[i].scanned = true;
                    itemInRoom = true;
                    break;
                }
            }
            $scope.$apply();
            return itemInRoom;
        }

        function refreshItemsList(items, checkItem) {
            var index = -1;
            for(var i = 0; i < items.length; i++) {
                if(items[i].id == checkItem) {
                    index = indexOfItem(vm.items.inWrongRoom, items[i]);
                    if(index > -1) {
                        vm.items.inWrongRoom.splice(index,1);
                        items[i].scanned = true;
                        vm.items.inRoom.push(items[i]);
                        break;
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

        function startScan() {
            if($window.cordova) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if(!result.cancelled){
                            saveScan(result.text);
                        }
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    },
                    {
                        "preferFrontCamera" : false, // iOS and Android
                        "showFlipCameraButton" : false, // iOS and Android
                        "prompt" : "Place a barcode inside the scan area", // supported on Android only
                    }
                );
            } else {
                // Do something here
            }
        }

        function saveScan(barcode) {
            // Check if the item scanned is already in the room or not
            if(!checkItem(barcode)) {
                // Check to see if the item has already been created or not
                getItemBarcodeApi(barcode)
                    .then(function success(item) {
                        // Item has already been created but is currently in the wrong room or creating new item
                        if(item) {
                            vm.items.inWrongRoom.push(item);
                        } else {
                            item = {
                                barcode: barcode,
                                roomId: vm.scanSettings.room.id,
                                creator: $rootScope.user.id
                            };
                            // Create basic item with new barcode
                            createItemApi(item)
                                .then(function success(item) {
                                    item.scanned = true;
                                    vm.items.newItems.push(item);
                                }).catch(function error() {
                                    // error handling
                                });
                        }
                    }).catch(function error() {
                        // error handling
                    });
            }
        }
    }
})();
