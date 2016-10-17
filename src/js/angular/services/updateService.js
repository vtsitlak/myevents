app.factory('updateService', ['$http', function($http) {
    //return update data from url
    return $http.get('https://api.superevent.com/v1/events/1882/speakers?sync=2016-10-12T14:54:35Z')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });

}]);