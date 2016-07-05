xmApp
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    'xmContent': {
                        templateUrl: './html/module/home.html',
                        controller: 'homeCtrl'
                    }
                }
            });

        $urlRouterProvider
            .otherwise('/home');

    });