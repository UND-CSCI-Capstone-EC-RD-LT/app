(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('Items', ['$rootScope', '$http', '$q', 'API', Items]);

    function Items($rootScope, $http, $q, API) {

        function getItem(itemId) {
            return $http.get(API.sailsUrl + '/items/getItem/' + itemId)
                .then(function success(res) {
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
                    if(res.data) {
                        return res.data.data[0];
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

        function createItem(item) {
            return $http({
                method: 'POST',
                headers: { 'Content-Type': 'application/form-data; charset=UTF-8' },
                data: {
                    barcode: item.barcode,
                    room: item.roomId,
                    creator: item.creator
                },
                url: (API.sailsUrl + '/items')
            }).then(function success(res) {
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

        function updateItem(item) {
            return $http({
                method: 'PUT',
                headers: { 'Content-Type': 'application/form-data; charset=UTF-8' },
                data: {
                    description: item.description,
                    type: item.type.id,
                    room: item.room.id,
                    boughtPrice: item.boughtPrice,
                    currentPrice: item.currentPrice
                },
                url: (API.sailsUrl + '/items/' + item.id)
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

        function getItemTypes() {
            return $http.get(API.sailsUrl + '/itemtypes/')
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


        return {
            getItem        : getItem,
            getItemBarcode : getItemBarcode,
            getItemTypes   : getItemTypes,
            createItem     : createItem,
            updateItem     : updateItem
        };
    }
})();
