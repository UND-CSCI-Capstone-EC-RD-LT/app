(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('Rooms', ['$rootScope', '$http', '$q', 'API', Rooms]);

    function Rooms($rootScope, $http, $q, API) {

        function getBuildingRooms(buildingId) {
            return $http.get(API.sailsUrl + '/rooms/building/'+buildingId)
                .then(function success(res) {
                    if(res.data) {
                        return res.data.data.rooms;
                    } else {
                        return $q.reject(res.data);
                    }
                }).catch(function error(reason) {
                    return $q.reject({
                        error: 'Error with API request.',
                        origErr: reason
                    });
                });
        }

        function updateExample(example) {
            return $http({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: 'example',
                url: (API.sailsUrlUrl + 'exampleRoute/exampleFunction')
            }).then(function success(res) {
                if(res.data) {
                    return;
                } else {
                    return $q.reject(res.data);
                }
            }).catch(function error(reason) {
                return $q.reject({
                    error: 'Error with API request.',
                    origErr: reason
                });
            });
        }

        function insertExample(exampleId, examplePayload) {
            return $http({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: 'example',
                url: (API.sailsUrl + 'exampleRoute/exampleFunction')
            }).then(function success(res) {
                if(res.data) {
                    return;
                } else {
                    return $q.reject(res.data);
                }
            }).catch(function error(reason) {
                return $q.reject({
                    error: 'Error with API request.',
                    origErr: reason
                });
            });
        }


        return {
            getBuildingRooms : getBuildingRooms,
            updateExample    : updateExample,
            insertExample    : insertExample
        };
    }
})();
