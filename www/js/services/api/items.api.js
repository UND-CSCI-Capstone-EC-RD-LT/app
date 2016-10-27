(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('Items', ['$rootScope', '$http', '$q', 'API', Items]);

    function Items($rootScope, $http, $q, API) {

        function getExample() {
            return $http.get(API.sailsUrl + 'exampleRoute/exmpleFunction/exampleId')
                .then(function success(res) {
                    if(res.data) {
                        return res.data;
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
            getExample: getExample,
            updateExample: updateExample,
            insertExample: insertExample
        };
    }
})();
