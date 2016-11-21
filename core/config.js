function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/login");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "core/login.html",
            data: { pageTitle: 'Вход' }
        })
        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "core/content.html"
        })
        .state('index.items', {
            url: "/items",
            templateUrl: "core/items/items.html",
            data: { pageTitle: 'Номенклатура' }
        })
        .state('index.orders', {
            url: "/orders",
            templateUrl: "core/orders/orders.html",
            data: { pageTitle: 'Заказы' }
        })
        .state('index.order', {
            url: "/order",
            templateUrl: "core/order/order.html",
            data: { pageTitle: 'Заказ' }
        })
}
angular
    .module('ordering')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
