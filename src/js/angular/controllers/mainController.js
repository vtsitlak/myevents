app.controller('mainController', ['$scope', 'speakersService', 'updateService', '$filter', '$localStorage', '$interval', function($scope, speakersService, updateService, $filter, $localStorage, $interval) {
    //main page controller
    //cache with ngStorage and synchronisation  explain:
    //load data from service
    //save data on localstorage
    //use data from localstorage if exist, else load from service
    //interval function every 5 minute
    //loads update data and synchronise/updates with the data from localStorage
    //caching on displaying data:
    //speaker list ordered by lastname
    //filter ordered speaker list on search input change (if any)
    //filter returns the speaker list items that the first name or last name or company
    //or job title starts like the search input
    //ordered-filtered speaker list is loaded to display by sets of 10 items
    //using the angular infinity scroll plugin

    //init heading letter 
    header = {
        show: false,
        letter: ''
    };

    // init the fisrt set of loaded data to infinity scroll 
    initScroll = function() {
        if (!$scope.scrolledSpeakers) {
            if ($scope.filteredSpeakers) {
                $scope.scrolledSpeakers = $scope.filteredSpeakers.slice(0, 10);
            }
        }
    }

    //speaker list filtering on change search input. updates the speaker list to be displayed and the first set
    $scope.filterSpeakers = function() {

        if ($scope.search == '' || $scope.search == null) {

            $scope.filteredSpeakers = $scope.orderedSpeakers;

        } else {
            if ($scope.orderedSpeakers) {

                var temp = [];

                var i = 0;
                for (i = 0; i < $scope.orderedSpeakers.length; i++) {

                    var f = false;

                    if ($scope.orderedSpeakers[i].firstName != null && $scope.orderedSpeakers[i].firstName != "") {
                        if ($scope.orderedSpeakers[i].firstName.toUpperCase().startsWith($scope.search.toUpperCase()) == true) {
                            f = true;

                        }
                    }
                    if ($scope.orderedSpeakers[i].lastName != null && $scope.orderedSpeakers[i].lastName != "") {
                        if ($scope.orderedSpeakers[i].lastName.toUpperCase().startsWith($scope.search.toUpperCase()) == true) {
                            f = true;

                        }
                    }
                    if ($scope.orderedSpeakers[i].company != null && $scope.orderedSpeakers[i].company != "") {
                        if ($scope.orderedSpeakers[i].company.toUpperCase().startsWith($scope.search.toUpperCase()) == true) {
                            f = true;

                        }
                    }
                    if ($scope.orderedSpeakers[i].jobTitle != null && $scope.orderedSpeakers[i].jobTitle != "") {
                        if ($scope.orderedSpeakers[i].jobTitle.toUpperCase().startsWith($scope.search.toUpperCase()) == true) {
                            f = true;

                        }
                    }

                    if (f == true) {

                        temp.push($scope.orderedSpeakers[i]);
                    }
                }
            }

            $scope.filteredSpeakers = temp;
            $scope.scrolledSpeakers = $scope.filteredSpeakers.slice(0, 10);
        }
    }

    //initialize speaker list. If speaker list is saved on locastorage, we use the localstorage
    //date. else we call the speakers service to load the the data from url and save them to localstorage
    //we initialize the rest of the speakers list
    getSpeakers = function() {

        if ($localStorage.speakers) {
            $scope.orderedSpeakers = $filter('orderBy')($localStorage.speakers.data, 'lastName');
            $scope.filteredSpeakers = $scope.orderedSpeakers;

            initScroll();

        } else {
            speakersService.success(function(data) {

                $localStorage.speakers = data;
                $scope.orderedSpeakers = $filter('orderBy')($localStorage.speakers.data, 'lastName');
                $scope.filteredSpeakers = $scope.orderedSpeakers;

                initScroll();
            }).error(function(data) {
                console.log('Error on getting the data');
            });
        }

    };


    //synchronise data und updates the speakers list and localstorage
    synchronisation = function(data1, data2) {
        var i = 0;

        for (i = 0; i < data2.data.length; i++) {


            switch (data2.data[i]._meta.actionType) {

                case 'm':
                    var index = data1.data.findIndex(x => x.id == data2.data[i].id);
                    if (index != -1) {
                        data1.data[index] = data2.data[i];
                    }
                    break;
                case 'i':
                    data1.data.push(data2.data[i]);
                    break;
                case 'd':
                    var index = data1.data.findIndex(x => x.id == data2.data[i].id);
                    if (index != -1) {

                        data1.data.splice(index, 1);
                    }
                    break;
            }
        }

        $localStorage.speakers = data1;
        $scope.orderedSpeakers = $filter('orderBy')($localStorage.speakers.data, 'lastName');
        $scope.filteredSpeakers = $scope.orderedSpeakers;
        initScroll();
    }

    //get the updates data from url and call synchronisation function
    updateSpeakers = function() {
        var update = {data:[]};
        updateService.success(function(data) {
            //comtrol to check if we have new records
            var c = 0;
            if ($localStorage.actionDate) {
                //we get only the new records, the ones more recent that saved on localStorage actionDate
                var i = 0;
                var temp = $localStorage.actionDate;
                for (i = 0; i < data.data.length; i++) {

                    if (data.data[i]._meta.actionDate > $localStorage.actionDate) {
                        update.data.push(data.data[i]);
                        c++
                        if (data.data[i]._meta.actionDate > temp) {
                            temp = data.data[i]._meta.actionDate;
                        }
                    }
                }
                $localStorage.actionDate = temp;

            } else {
                
                update = data;
                //we set the localStorage actionDate, as the maximum actionDate from our current update data
                var temp = data.data[0].type.actionDate;
                var i = 1;
                for (i = 1; i < data.data.length; i++) {
                    if (data.data[i]._meta.actionDate > temp) {
                        temp = data.data[i]._meta.actionDate;
                    }
                }
                $localStorage.actionDate = temp;
                c = data.data.length;

            }
            console.log('c='+c);
            if (c > 0) {
                synchronisation($localStorage.speakers, update);
            }

        }).error(function(data) {
            console.log('Error on getting the data');
        });
    }


    //return default image link in speaker image is null
    $scope.imgNull = function(imgLink) {

        if (imgLink == null) {
            imgLink = 'images/speaker.jpg';
        }
        return imgLink;
    }

    //updates the heading letter on speakers list display
    $scope.heading = function(lastName) {

        if (lastName.slice(0, 1).toUpperCase() !== header.letter.toUpperCase()) {
            header.show = true;
            header.letter = lastName.slice(0, 1).toUpperCase();

        } else {
            header.show = false;
            header.letter = lastName.slice(0, 1).toUpperCase();
        }
        return header;
    };


    //updates the speakers list to display, sending the next set of 10 items
    $scope.loadMore = function() {

        if ($scope.scrolledSpeakers) {
            var last = $scope.scrolledSpeakers.length - 1;
            if ($scope.filteredSpeakers) {
                $scope.scrolledSpeakers = $scope.filteredSpeakers.slice(0, last + 10);
            }
        }
    }

    //call the data init function
    getSpeakers();

    //update data every 5 minutes 
    $interval(updateSpeakers, 3000);

}]);