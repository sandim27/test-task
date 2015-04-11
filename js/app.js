var app = angular.module('app', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.when('/users', {
        templateUrl: 'users/users.html',
        controller: 'UsersCtrl'
    });
    $routeProvider.when('/groups', {
        templateUrl: 'groups/groups.html',
        controller: 'GroupsCtrl'
    });

})

app.factory("pagination", function ($sce) {
    var currentPage = 0;
    var itemPage = 4;
    var users = [];
    return {
        setUsers: function (newUsers) {
            users = newUsers;
        },
        getUsers: function (num) {
            var num = angular.isUndefined(num) ? 0 : num;
            var first = itemPage * num;
            var last = first + itemPage;
            currentPage = num;
            last = last > users.length ? (users.length - 1) : last;
            return users.slice(first, last);
        },
        getTotalPage: function () {
            return Math.ceil(users.length / itemPage)
        },
        getList: function () {
            var pageNum = this.getTotalPage();
            var paginationList = [];
            paginationList.push({
                name: $sce.trustAsHtml('&laquo;'),
                link: "prev"
            })
            for (var i = 0; i < pageNum; i++) {
                var col = i + 1;
                paginationList.push({
                    name: $sce.trustAsHtml(String(col)),
                    link: i
                });
            }
            paginationList.push({
                name: $sce.trustAsHtml('&raquo;'),
                link: "next"
            });
            if (pageNum > 1) {
                return paginationList;
            } else {
                return false;
            }
        },
        getCurrentPage: function () {
            return currentPage;
        },
        getPrev: function () {
            var prevPage = currentPage - 1;
            if (prevPage < 0) prevPage = 0;
            return this.getUsers(prevPage);
        },
        getNext: function () {
            var nextPage = currentPage + 1;
            var pagesNum = this.getTotalPage();
            if (nextPage >= pagesNum) nextPage = pagesNum - 1;
            return this.getUsers(nextPage);
        }
    }
})

app.controller('HomeCtrl', function ($http, $scope, pagination) {

});

app.controller('UsersCtrl', function ($http, $scope, pagination) {
    $http.get("./json/users.json")
        .success(function (data) {
            $scope.tableUsers = data;
            pagination.setUsers(data);
            $scope.users = pagination.getUsers();
            $scope.paginationList = pagination.getList(data);
            $scope.showPage = function (page) {
                if (page == "prev") {
                    $scope.users = pagination.getPrev(page);
                } else if (page == "next") {
                    $scope.users = pagination.getNext(page);
                } else {
                    $scope.users = pagination.getUsers(page);
                }
            }
            $scope.currentPage = function () {
                return pagination.getCurrentPage()
            }
        });
});
app.controller('GroupsCtrl', function ($http, $scope, pagination) {
    $http.get("./json/groups.json")
        .success(function (data) {
            pagination.setUsers(data);
            $scope.groups = pagination.getUsers();
            $scope.paginationList = pagination.getList(data);
            $scope.showPage = function (page) {
                if (page == "prev") {
                    $scope.groups = pagination.getPrev(page);
                } else if (page == "next") {
                    $scope.groups = pagination.getNext(page);
                } else {
                    $scope.groups = pagination.getUsers(page);
                }
            }
            $scope.currentPage = function () {
                return pagination.getCurrentPage()
            }
        });
});

