var app = angular.module('PaintingsList', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/home.html'
            })
            .when('/Photo/:paintingId', {
                templateUrl: '/views/painting.html',
                controller: 'PaintingController',
                controllerAs: 'painting'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }])
    .controller('MainController', ['$scope', '$route', '$routeParams', '$location', function MainController($scope, $route, $routeParams, $location) {
        this.$route = $route;
        this.$location = $location;
        this.$routeParams = $routeParams;
        $.ajax({
            url: "/paintings/assets/photos",
            dataType: "json",
            success: json => {
                $scope.list = json;
                $scope.$apply();
            }
        });
        // $.getJSON("/assets/photos").then(json => {
        //     console.log(json);
        //     $scope.list = json;
        //     $scope.$apply();
        // });
    }])
    .controller('PaintingController', ['$routeParams', function PaintingController($routeParams) {
        this.name = 'PaintingController';
        this.params = $routeParams;

        var id = this.params.paintingId;
        var pos = id.indexOf("___");
        this.artist = id.substring(0, pos).replaceAll("_", " ");
        this.title = id.substring(pos + 3, id.length - 4).replaceAll("_", " ");
    }]);