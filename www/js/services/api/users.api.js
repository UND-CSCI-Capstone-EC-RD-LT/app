(function() {
    'use strict';

    angular
        .module('app.api')
        .factory('Users', ['$http', '$q', 'API', Users]);

    function Users($http, $q, API) {


        return { };
    }
})();
