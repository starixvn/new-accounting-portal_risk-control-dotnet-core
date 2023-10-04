(function (angular, undefined) {
    'use strict';

    angular
        .module('app.numberGameStatisticApp')
        .service('numberGameStatisticService', numberGameStatisticService);

    numberGameStatisticService.$inject = ['templateSetting', 'universalSettings'];
    function numberGameStatisticService(templateSetting, universalSettings) {
        var service = {
            getTemplate: getTemplate,
            getTemplateSetting: getTemplateSetting,
            resolveProductPath: resolveProductPath,
            resolveServiceUrl: resolveServiceUrl
        };
        return service;

        function resolveProductPath(productName) {
            if (productName === 'Live Casino' || productName === 'Casino') {
                return 'casino';
            }
            return productName.replace(/\s+/g, '-').replace(/\-+/g, '-');
        }

        function resolveServiceUrl(productName, suffix) {
            return 'api/company-win-loss/' + resolveProductPath(data.productName) + '/' + suffix;
        }

        function getTemplateSetting(productName) {
            var productSetting = templateSetting[productName];
            if (!angular.isUndefined(productSetting)) {
                return productSetting;
            }

            return universalSettings.settings;
        }

        function getTemplate(data, type) {
            if (type === 'product') {
                return {
                    templateUrl: 'app/number-game-statistic/shared/fanex-grid-with-title.html',
                    controller: 'ProductController',
                    service: 'productService'
                };
            }

            var productSetting = getTemplateSetting(data.productName);
            if (angular.isUndefined(productSetting)) {
                return undefined;
            }

            var template = productSetting[type];
            if (angular.isUndefined(template)) {
                return undefined;
            }

            var templateUrl = template.templateUrl;
            if (angular.isFunction(templateUrl)) {
                templateUrl = templateUrl(data);
            }

            var controller = template.controller;
            if (angular.isFunction(controller)) {
                controller = controller(data);
            }

            var service = template.service;
            if (angular.isFunction(service)) {
                service = service(data);
            }

            return {
                templateUrl: templateUrl,
                controller: controller,
                service: service
            };
        }
    }
})(angular, undefined);