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
        // The new item modal
        var newItemModal = null;

        var newItem = {};

        // Returning to scan state from edit state and refreshing item list for changes
        $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
            if(fromState.name == 'app.edit-item') {
                if(vm.scanSettings.scanType == 'Single Item') {
                    resetScanSettings();
                } else {
                    getRoomItemsApi(vm.scanSettings.room.id)
                        .then(function success(items) {
                            var itemId = fromParams.itemId;
                            refreshItemsList(items, itemId);
                        }).catch(function error() {
                            // error handling
                        });  
                }
                
            }
        });

        // DEVELOPMENT ONLY
        // WAITING SO THE JWT TOKEN IS SET BEFORE CALLING
        $timeout(function() {
            onEnter();
        }, 1000);

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            vm.render = false;

            vm.title = 'Set Scan Settings';

            newItem = {};

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
            vm.types = [];

            vm.manualScan = false;
            if(!$window.cordova) {
                vm.barcode = null;
                vm.manualScan = true;
            }

            vm.render = true;
            getData(isRefresh);
        }

        // Retrieves the data from the db
        function getData(isRefresh) {

            var d1 = $q.defer();
            var d2 = $q.defer();

            getDepartmentsApi()
                .then(function success(departments) {
                    vm.departments = departments;
                    d1.resolve();
                }).catch(function error() {
                    // error handling
                    d1.reject();
                });

            getItemTypesApi()
                .then(function success(types) {
                    vm.types = types;
                    d2.resolve();
                }).catch(function error() {
                    // error handling
                    d2.reject();
                });

             $q.all([d1.promise, d2.promise])
                .then(function success() {

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

        function getItemTypesApi() {
            return Items.getItemTypes()
                .then(function success(types) {
                    return types;
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

        vm.hideNewItemModal = function() {
            hideNewItemModal();
        };

        vm.confirmNewItem = function(){
            // Create basic item with new barcode
            newItem.type = vm.itemType.id
            createItemApi(newItem)
                .then(function success(item) {
                    item.scanned = true;
                    vm.items.inRoom.push(item);
                    hideNewItemModal();
                    newItem = {};
                }).catch(function error() {
                    // error handling
                });
        }

        vm.newScan = function() {
            hideScanSettingsModal();
            resetScanSettings();
        };

        //TODO sort into dropdown by item type
        vm.confirmScanSettings = function() {
            getRoomItemsApi(vm.scanSettings.room.id)
                .then(function success(items) {
                    vm.items.inRoom = items;
                    vm.scanSettings.set = true;
                    vm.title = 'Scan Items';
                    if(vm.scanSettings.scanType == 'Single Item' && $window.cordova) {
                        startScan();
                    }
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

        // Hides the scan settings modal
        function hideScanSettingsModal() {
            if(scanSettingsModal){
                scanSettingsModal.hide();
            }
        }

        function showNewItemModal() {
            if(!newItemModal) {
                $ionicModal.fromTemplateUrl('templates/modals/new-item.html', {
                    scope: $scope,
                    animation: 'slide-in-up' // maybe use slide-in-down if it works on mobile
                }).then(function success(modal) {
                    newItemModal = modal;
                    newItemModal.show();
                });
            } else {
                newItemModal.show();
            }
        }

        // Hides the new item modal
        function hideNewItemModal() {
            if(newItemModal){
                newItem = {};
                newItemModal.hide();
            }
        }

        //// END MODAL FUNCTIONS ////

        function checkItem(barcode){
            var item = null;
            for(var i = 0; i < vm.items.inRoom.length; i++) {
                if(vm.items.inRoom[i].barcode == barcode) {
                    vm.items.inRoom[i].scanned = true;
                    item = vm.items.inRoom[i];
                    break;
                }
            }
            return item;
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
                            saveItem(result.text);
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
                // Manually Enter Barcode
                var barcode = vm.barcode;
                vm.barcode = null;
                saveItem(barcode);
            }
        }

        function saveItem(barcode) {
            // Check if the item scanned is already in the room or not
            var item = checkItem(barcode);
            if(!item) {
                // Check to see if the item has already been created or not
                getItemBarcodeApi(barcode)
                    .then(function success(item) {
                        // Item has already been created but is currently in the wrong room or creating new item
                        if(item) {
                            // Go directly to edit item for single item scans
                            if(vm.scanSettings.scanType == 'Single Item') {
                                vm.editItem(item);
                            } else {
                                vm.items.inWrongRoom.push(item);
                            }
                            
                        } else {
                            newItem = {
                                barcode: barcode,
                                room: vm.scanSettings.room.id,
                                type: null,
                                creator: $rootScope.user.id
                            };
                            showNewItemModal();
                        }
                    }).catch(function error() {
                        // error handling
                    });
            } else {
                if($window.cordova){
                    $scope.$apply();
                }
                // Go directly to edit item for single item scans
                if(vm.scanSettings.scanType == 'Single Item') {
                    vm.editItem(item);
                }
            }
        }

        function resetScanSettings() {
            vm.title = 'Set Scan Settings';
            vm.scanSettings.room = null;
            vm.scanSettings.set = false;
            vm.items = {
                inRoom: [],
                inWrongRoom: [],
                newItems: []
            };
        }
    }
})();
