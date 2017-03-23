(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ItemScanHistoryController', ['$scope', '$stateParams', '$q', '$ionicHistory', 'Items', ItemScanHistoryController]);

    function ItemScanHistoryController($scope, $stateParams, $q, $ionicHistory, Items) {
        var vm = this;

        onEnter();

        //// INITIALIZATION FUNCTIONS ////

        function onEnter(isRefresh) {
            vm.render = false;

            vm.history = [1,2,3,4,5];

            vm.title = 'M12345 Scan History';

            getData(isRefresh);
        }

        // Retrieves the data from the db
        function getData(isRefresh) {
            // getItemScanHistoryApi($stateParams.itemId)
            //     .then(function success(history) {
            //         vm.history = history;

            //         vm.render = true;

            //         if(isRefresh) {
            //             $scope.$broadcast('scroll.refreshComplete');
            //         }

            //     });

            vm.render = true;
            if(isRefresh) {
                $scope.$broadcast('scroll.refreshComplete');
            }
        }

        //// END INITIALIZATION FUNCTIONS ////

        //// API FUNCTIONS ////

        function getItemScanHistoryApi(itemId) {
            return Items.getItemScanHistory(itemId)
                .then(function success(history) {
                    return history;
                }).catch(function error(reason) {
                    //error handling
                    $ionicHistory.clearCache().then(function(){ $state.go('error', {reason: reason}); });
                    return $q.reject();
                });
        }

        //// END API FUNCTIONS ////

        //// VIEW MODEL FUNCTIONS ////

        vm.onRefresh = function() {
            onEnter(true);
        }

        //// END VIEW MODEL FUNCTIONS ////
    }
})();
