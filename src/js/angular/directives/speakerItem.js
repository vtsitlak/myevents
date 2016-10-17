app.directive('speakerItem', [function () {
    // set the speakerItem directive
    return {
        restrict: 'E',
        scope: {
            speaker: '=',
            h: '=',
            img: '='
        },
        
        templateUrl: 'parts/speakerItem.html'        
    };
}]);