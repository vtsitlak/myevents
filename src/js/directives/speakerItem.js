app.directive('speakerItem', [function () {
    // set the speakerItem directive
    return {
        restrict: 'E',
        scope: {
            speaker: '='
        },
        
        templateUrl: 'parts/speakerItem.html'        
    };
}]);