app.controller('speakerController', ['$scope', '$stateParams', function($scope, $stateParams) {

    //get speaker data from stateparams
    $scope.speaker = $stateParams.speaker;

    //default image link in speaker image is null
    $scope.imgLink = '';
    if ($scope.speaker.image == null || $scope.speaker.image == '') {
        $scope.imgLink = 'images/speaker.jpg';
    } else {
        $scope.imgLink = $scope.speaker.image;

    }
    
}]);