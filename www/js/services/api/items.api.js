(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('Items', ['$rootScope', '$http', '$q', 'API', Items]);

    function Items($rootScope, $http, $q, API) {

        function getItem(itemId) {
            return $http.get(API.sailsUrl + '/items/' + itemId)
                .then(function success(res) {
                    console.log(res);
                    if(res.data) {
                        return res.data.data;
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

        function getItemBarcode(barcode) {
            return $http.get(API.sailsUrl + '/items/barcode/' + barcode)
                .then(function success(res) {
                    console.log(res);
                    if(res.data) {
                        return res.data.data;
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
            getItem        : getItem,
            getItemBarcode : getItemBarcode,
            updateExample  : updateExample,
            insertExample  : insertExample
        };
    }
})();
