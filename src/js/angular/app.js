var app = angular.module('myEvents', ['ui.router', 'ngStorage', 'infinite-scroll' ]);

// set the routes
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // set html5 mode to avoid # symbol on url
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('main', {
        url: '/',
        controller: 'mainController',
        templateUrl: 'parts/main.html',

    })
    
    // on speaker state we define parameters for the speaker id and speaker
    .state('speaker', {
        url: '/speaker/:_id',
        templateUrl: 'parts/speaker.html',
        controller: 'speakerController',
        params: {
            _id: null,
            speaker: {}
        }
    })

});