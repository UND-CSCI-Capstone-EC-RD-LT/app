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

        // Holds new item data
        var newItem = {};

        var editedItem = {};

        // Returning to scan state from edit state and refreshing item list for changes
        $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
            if(fromState.name == 'app.edit-item') {
                if(vm.scanSettings.scanType == 'Single Item') {
                    resetScanSettings();
                } else {
                    getItemApi(fromParams.itemId)
                        .then(function success(item) {
                            // In wrong room item object looks different than in room item object
                            console.log(editedItem);
                            if(editedItem.room !== item.roomId && item.roomId === vm.scanSettings.room.id) {
                                if(editedItem.type !== item.itemTypeId){
                                    // Remove item from old type list
                                    for (var i = 0; i < vm.room.inRoom[editedItem.type].items.length; i++) {
                                        if(vm.room.inRoom[editedItem.type].items[i].id === editedItem.id) {
                                            vm.room.inRoom[editedItem.type].items.splice(i, 1);
                                            break;
                                        }
                                    }
                                    // Decrement scanned count for old type if it was scanned before
                                    if(editedItem.scanned) {
                                        vm.room.inRoom[editedItem.type].scanned--;
                                    }
                                    // Switch the item type to the new type
                                    editedItem.type = item.itemTypeId
                                    // Increment scanned count for new type if it was scanned before
                                    if(editedItem.scanned) {
                                        vm.room.inRoom[editedItem.type].scanned++;
                                    }
                                    // Add item to new type list
                                    vm.room.inRoom[editedItem.type].items.push(editedItem);
                                }
                            } else if(editedItem.room.id === item.roomId) {
                                if(editedItem.type !== item.itemTypeId){
                                    // Remove item from old type list
                                    for (var i = 0; i < vm.room.inRoom[editedItem.type].items.length; i++) {
                                        if(vm.room.inRoom[editedItem.type].items[i].id === editedItem.id) {
                                            vm.room.inRoom[editedItem.type].items.splice(i, 1);
                                            break;
                                        }
                                    }
                                    // Decrement scanned count for old type if it was scanned before
                                    if(editedItem.scanned) {
                                        vm.room.inRoom[editedItem.type].scanned--;
                                    }
                                    // Switch the item type to the new type
                                    editedItem.type = item.itemTypeId
                                    // Increment scanned count for new type if it was scanned before
                                    if(editedItem.scanned) {
                                        vm.room.inRoom[editedItem.type].scanned++;
                                    }
                                    // Add item to new type list
                                    vm.room.inRoom[editedItem.type].items.push(editedItem);
                                }
                            }
                            
                        });
                    // getRoomItemsApi(vm.scanSettings.room.id)
                    //     .then(function success(items) {
                    //         var itemId = fromParams.itemId;
                    //         refreshItemsList(items, itemId);
                    //     }).catch(function error() {
                    //         // error handling
                    //     });
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

            vm.room = {
                inRoom: {},
                inWrongRoom: []
            };

            vm.hasItemsInRoom = true;

            vm.itemType = null;

            vm.departments = [];
            vm.buildings = [];
            vm.rooms = [];
            vm.types = {};

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
                    for (var i = 0; i < types.length; i++) {
                        vm.types[types[i].id] = types[i];
                        vm.room.inRoom[types[i].id] = {
                            name: types[i].name,
                            id: types[i].id,
                            scanned: 0,
                            items: []
                        }
                    }

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

        function getItemApi(itemId) {
            return Items.getItem(itemId)
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
            showScanSettingsModal();
        };

        vm.hideScanSettings = function() {
            hideScanSettingsModal();
        };

        vm.hideNewItemModal = function() {
            hideNewItemModal();
        };

        vm.confirmNewItem = function(){
            // Create basic item with new barcode
            newItem.type = vm.itemType.id;
            createItemApi(newItem)
                .then(function success(item) {
                    item.scanned = true;
                    vm.room.inRoom[newItem.type].scanned++;
                    vm.room.inRoom[newItem.type].items.push(item);
                    hideNewItemModal();
                    newItem = {};
                }).catch(function error() {
                    // error handling
                });
        };

        vm.confirmScanSettings = function() {
            getRoomItemsApi(vm.scanSettings.room.id)
                .then(function success(items) {
                    if(items.length > 0) {
                        sortItemsByType(items);
                    } else {
                        vm.hasItemsInRoom = false;
                    }
                    vm.scanSettings.set = true;
                    vm.title = 'Scan Items';
                    if(vm.scanSettings.scanType == 'Single Item' && $window.cordova) {
                        startScan();
                    }
                }).catch(function error() {
                    // error handling
                });
        };

        vm.newScan = function() {
            hideScanSettingsModal();
            resetScanSettings();
        };

        vm.startScan = function(){
            startScan();
        };

        vm.editItem = function(item) {
            editedItem = item;
            $state.go('^.edit-item', {itemId: item.id});
        };

        // Opens a type accordion
        vm.toggleItemTypeOpen = function(type) {
           type.isOpen = !type.isOpen;
        };

        //// END VIEW MODEL FUNCTIONS ////

        //// MODAL FUNCTIONS ////

        // Hides the scan settings modal
        function showScanSettingsModal() {
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

        function hideScanSettingsModal() {
            if(scanSettingsModal){
                scanSettingsModal.hide();
            }
        }

        //// END MODAL FUNCTIONS ////

        function refreshItemsList(items, checkItem) {
            var index = -1;
            for(var i = 0; i < items.length; i++) {
                if(items[i].id == checkItem) {
                    index = indexOfItem(vm.room.inWrongRoom, items[i]);
                    if(index > -1) {
                        vm.room.inWrongRoom.splice(index,1);
                        items[i].scanned = true;
                        vm.room.inRoom.push(items[i]);
                    }
                    break;
                }
            }
        }

        // TODO update checkItem function to work with new sorted item list by item type
        function checkItem(barcode) {
            var item = null;
            var type = null;
            for(var key in vm.room.inRoom) {
                type = vm.room.inRoom[key];
                for (var y = 0; y < type.items.length; y++) {
                    if(type.items[y].barcode == barcode) {
                        item = type.items[y];
                        if(!type.items[y].scanned){
                            type.scanned++;
                            type.items[y].scanned = true;
                        }
                        break;
                    }
                }
            }
            return item;
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
                                vm.room.inWrongRoom.push(item);
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
            vm.room = {
                inRoom: {},
                inWrongRoom: []
            };
            vm.itemType = null;
            getItemTypesApi()
                .then(function success(types) {
                    for (var i = 0; i < types.length; i++) {
                        vm.types[types[i].id] = types[i];
                        vm.room.inRoom[types[i].id] = {
                            name: types[i].name,
                            id: types[i].id,
                            scanned: 0,
                            items: []
                        }
                    }
                });
        }

        function indexOfItem(array, item) {
            for (var i = 0; i < array.length; i++) {
                if(array[i].id === item.id) {
                    return i;
                }
            }
            return -1;
        }

        function sortItemsByType(items) {
            for (var i = 0; i < items.length; i++) {
                vm.room.inRoom[items[i].type].items.push(items[i]);
            }
        }
    }
})();
