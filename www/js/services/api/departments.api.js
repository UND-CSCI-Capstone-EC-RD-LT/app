(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('Departments', ['$rootScope', '$http', '$q', 'API', Departments]);

    function Departments($rootScope, $http, $q, API) {

        function getDepartments() {
            return $http.get(API.sailsUrl + '/departments')
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
            getDepartments : getDepartments,
            updateExample  : updateExample,
            insertExample  : insertExample
        };
    }
})();
