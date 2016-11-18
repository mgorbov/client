/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/login");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: { pageTitle: 'Вход' }
        })
        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html"
        })
        .state('index.items', {
            url: "/items",
            templateUrl: "views/items.html",
            data: { pageTitle: 'Номенклатура' }
        })
        .state('index.orders', {
            url: "/orders",
            templateUrl: "views/orders.html",
            data: { pageTitle: 'Заказы' }
        })
        .state('index.order', {
            url: "/order",
            templateUrl: "views/order.html",
            data: { pageTitle: 'Заказ' }
        })
}
angular
    .module('ordering')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
