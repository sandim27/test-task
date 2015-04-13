var app = angular.module('app', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.when('/users', {
        templateUrl: 'users/users.html',
        controller: 'UsersCtrl'
    });
    $routeProvider.when('/groups', {
        templateUrl: 'groups/groups.html',
        controller: 'GroupsCtrl'
    });
    $routeProvider.when('/user/:name', {
        templateUrl: 'users/user.html',
        controller: 'UserCtrl'

    });
    $routeProvider.when('/group/:group', {
        templateUrl: 'groups/group.html',
        controller: 'GroupCtrl'

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
        },
        editUser: function (edit, data) {
            for (var i = 0; i < data.length; i++) {
                if (edit === data[i].userid) {
                    return data[i]
                }
            }
        },
        editGroup: function (edit, data) {
            for (var i = 0; i < data.length; i++) {
                if (edit === data[i].group) {
                    return data[i]
                }
            }
        },
        searchItem: function (newUser, table) {
            var result = [];
            for (var i = 0; i < newUser.length; i++) {
                for (var j = 0; j < table.length; j++) {
                    if (newUser[i] == table[j].group) {
                        result[i] = table[j];
                    }
                }
            }
            return result
        },
        searchItemGroup: function (newGr, table) {
            var result = [];
            for (var i = 0; i < newGr.length; i++) {
                for (var j = 0; j < table.length; j++) {
                    if (newGr[i] == table[j].userid) {
                        result[i] = table[j];
                    }
                }
            }
            return result
        }
    }
})

app.controller('HomeCtrl', function ($http, $scope, $routeParams, $location, pagination) {

    $http.get("./json/users.json")
        .success(function (data) {
            $scope.tableUsers = data;
        });
    $http.get("./json/groups.json")
        .success(function (data) {
            $scope.tableGroups = data;
        });
});

app.controller('UsersCtrl', function ($scope, $http, pagination) {
    pagination.setUsers($scope.tableUsers);
    $scope.users = pagination.getUsers();
    $scope.paginationList = pagination.getList($scope.tableUsers);
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
app.controller('GroupsCtrl', function ($scope, $http, pagination) {
    pagination.setUsers($scope.tableGroups);
    $scope.groups = pagination.getUsers();
    $scope.paginationList = pagination.getList($scope.tableGroups);
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
app.controller('UserCtrl', function ($http, $scope, $routeParams, pagination, $location) {
    $scope.user = pagination.editUser($routeParams.name, $scope.tableUsers);
    $scope.params = {
        userid: "",
        username: "",
        name: "",
        mail: ""

    }
    $scope.$watch('user.userid', function (val) {
        $scope.params.userid = val;
    });
    $scope.$watch('user.username', function (val) {
        $scope.params.username = val;
    });
    $scope.$watch('user.name', function (val) {
        $scope.params.name = val;
    });
    $scope.$watch('user.mail', function (val) {
        $scope.params.mail = val;

    });
    $scope.save = function () {
        for (var i = 0; i < $scope.tableUsers.length; i++) {
            if ($scope.user.userid == $scope.tableUsers[i].userid) {
                return $scope.tableUsers[i] = $scope.params
            }
        }
    };
    $scope.back = function () {
        $location.path("users")
    };

    $scope.searchItem = pagination.searchItem($scope.user.groups, $scope.tableGroups)
});


app.controller('GroupsCtrl', function ($scope, $http, pagination) {
    pagination.setUsers($scope.tableGroups);
    $scope.groups = pagination.getUsers();
    $scope.paginationList = pagination.getList($scope.tableGroups);
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
app.controller('GroupCtrl', function ($http, $scope, $routeParams, pagination, $location) {
    $scope.user = pagination.editGroup($routeParams.group, $scope.tableGroups);
    $scope.params = {
        group: "",
        title: ""
    }

    $scope.$watch('user.group', function (val) {
        $scope.params.group = val;
    });
    $scope.$watch('user.title', function (val) {
        $scope.params.username = val;
    });
    $scope.save = function () {
        for (var i = 0; i < $scope.tableUsers.length; i++) {
            if ($scope.user.userid == $scope.tableUsers[i].userid) {
                return $scope.tableUsers[i] = $scope.params
            }
        }
    };

    $scope.back = function () {
        $location.path("groups")
    };

    $scope.searchItemGroup = pagination.searchItemGroup($scope.user.users, $scope.tableUsers)

});
