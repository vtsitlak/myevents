app.factory('speakersService', ['$http', function($http) {
    //return init data from url
    return $http.get('https://api.superevent.com/v1/events/1882/speakers')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });

}]);