(function (angular) {
    'use strict';

    angular
        .module('app.core')
        .config(config);

    config.$inject = ['$routeProvider', '$httpProvider', 'config'];
    function config($routeProvider, $httpProvider, config) {
        configRouting();
        configHttp();

        function configRouting() {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/number-game-statistic/number-game-statistic.html',
                    controller: 'NumberGameStatisticController',
                    controllerAs: 'vm'
                })                
                .otherwise({
                    redirectTo: '/'
                });
        }

        function configHttp() {
            $httpProvider.interceptors.push(templateInterceptor);
            templateInterceptor.$inject = ['$templateCache'];
            function templateInterceptor($templateCache) {
                return {
                    request: function (c) {
                        var url = c.url;
                        if ($templateCache.get(url) === undefined) {
                            var protocol = url.substring(0, 4);
                            var extension = url.substring(url.length - 4);
                            if (protocol.toLowerCase() !== 'http') {
                                url = config.rootUrl + '/' + url;
                            }
                            if (extension.toLowerCase() === 'html') {
                                url = url + "?v=4.1";
                            }
                        }

                        c.url = url;
                        return c;
                    }
                };
            }

            $httpProvider.interceptors.push(loadingInterceptor);
            loadingInterceptor.$inject = ['$q', '$rootScope'];
            function loadingInterceptor($q, $rootScope) {
                return {
                    request: function (config) {
                        $rootScope.$broadcast('loading-started');
                        return config || $q.when(config);
                    },
                    response: function (response) {
                        $rootScope.$broadcast('loading-complete');
                        return response || $q.when(response);
                    }, responseError: function (response) {
                        $rootScope.$broadcast('loading-complete');
                        return $q.reject(response);
                    }
                };
            }
        }
    }
})(angular);