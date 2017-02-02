(function() {
    'use strict';

    angular
        .module('app')
        .config(['$ionicConfigProvider', AppConfig]);

    function AppConfig($ionicConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);
    }
})();