(function() {
    'use strict';

    angular
        .module('app')
        .config(['$stateProvider', '$urlRouterProvider', AppRoutes]);

    function AppRoutes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/app/scan-items');

        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppController',
                controllerAs: 'vm'
            })

            .state('app.scan-items', {
                url: '/scan-items',
                views: {
                  'menuContent': {
                    templateUrl: 'templates/scan-items.html',
                        controller: 'ScanItemsController',
                        controllerAs: 'vm'
                  }
                }
            })

            .state('app.edit-item', {
                url: '/edit-item/:itemId',
                views: {
                  'menuContent': {
                    templateUrl: 'templates/edit-item.html',
                        controller: 'EditItemController',
                        controllerAs: 'vm'
                  }
                }
            })

            .state('app.view-items', {
                url: '/view-items',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/view-items.html',
                        controller: 'ViewItemsController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.user-information', {
                url: '/user-information',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/user-information.html',
                        controller: 'UserInformationController',
                        controllerAs: 'vm'
                    }
                }
            })

          .state('app.admin-tools', {
                url: '/admin-tools',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/admin-tools.html',
                        controller: 'AdminToolsController',
                        controllerAs: 'vm'
                    }
                }
          });
    }
})();
