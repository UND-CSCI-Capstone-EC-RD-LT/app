(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('API', ['$rootScope', '$http', '$q', '$window', API]);

    function API($rootScope, $http, $q, $window, $cookies) {

        var sailsUrl = 'http://localhost:3000/v1';

        var errorTypes = {};

        // Creates a new session on the server, returning the session ID
        function login(email, password) {  
            return $http({
                method: 'POST',
                headers: { 'Content-Type': 'application/form-data; charset=UTF-8' },
                data: {
                    email: email,
                    password: password
                },
                url: (sailsUrl + '/auth/signin')
            }).then(function success(res) {
                if(res.data) {
                    //Authentication Token
                    $http.defaults.headers.common.Authorization = 'JWT ' + res.data.data.token;
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
            sailsUrl: sailsUrl,
            errorTypes: errorTypes,
            login: login
        };
    }
})();