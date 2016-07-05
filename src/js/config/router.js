xmApp
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    'xmContent': {
                        templateUrl: './html/module/login.html',
                        controller: 'loginCtrl'
                    }
                }
            })
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
            .when('/', '/login')
            .otherwise('/404');

    });