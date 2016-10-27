(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('API', ['$rootScope', '$http', '$q', '$window',API]);

    function API($rootScope, $http, $q, $window, $cookies) {

        var sailsUrl = 'http://localhost:3000/';

        var errorTypes = {
            GENERAL: 0,
            NO_SESSION: 1,
            NOT_LOGGED_IN: 2,
            NOT_AUTH: 3,
            DB_ERROR: 4,
            INVALID_LOGIN: 5,
            NO_ADID: 6,
            MULTIPLE_ADID: 7,
            UPDATE_USER_INFO: 8,
            NO_PRIVACY_POLICY: 9,
            FLIGHT_PUBS_PAGE_DELETED: 10
        };
        $http.defaults.headers.common.Authorization = 'JWT {{token}}';
        // Creates a new session on the server, returning the session ID
        function createSession() {
            /* jshint validthis: true */
            var self = this;

            return $http.get(sailsUrl + 'user/getSessionID')
                .then(function success(res) {
                    if(res.data && res.data.sessionId) {
                        if(!$window.cordova) {
                            $cookies.put('mobileSession', res.data.sessionId);
                        }
                        $rootScope.sessionId = res.data.sessionId;
                        return;
                    } else {
                        return $q.reject(res.data);
                    }
                }).catch(function error(reason) {
                    if(reason.status <= 0) {
                        return self.createSession();
                    } else {
                        return $q.reject({
                            error: 'Error with API request.',
                            origErr: reason
                        });
                    }
                });
        }

        function isAuthenticated(sessionId) {
            return $http.get(sailsUrl + 'login/isAuthenticated/' + $rootScope.sessionId + '/' + sessionId)
                .then(function success(res) {
                    if(res.data && (res.data.isAuthenticated !== undefined)) {
                        return res.data.isAuthenticated;
                    } else {
                        if(!$window.cordova) {
                            $cookies.remove('mobileSession');
                        }
                        $rootScope.sessionId = '';
                        return $q.reject(res.data);
                    }
                }).catch(function error(reason) {
                    return $q.reject({
                        error: 'Error with API request.',
                        origErr: reason
                    });
                });
        }

        function checkForAppUpdate(version) {
            return $http.get(sailsUrl + 'checkForAppUpdate/' + $rootScope.sessionId + '/' + version)
                .then(function success(res) {
                    if(res.data && (res.data.needsUpdate !== undefined)) {
                        return res.data.needsUpdate;
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
            createSession: createSession,
            isAuthenticated: isAuthenticated,
            checkForAppUpdate: checkForAppUpdate
        };
    }
})();
