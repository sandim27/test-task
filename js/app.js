var app = angular.module('app', ['ngRoute'])

app.controller('mainCtrl', function ($http, $scope) {
    $http.get("./json/users.json")
        .success(function (data) {
            $scope.tableUsers = data;
        });
    $http.get("./json/groups.json")
        .success(function (data) {
            $scope.tableGroups = data;
        });
});
