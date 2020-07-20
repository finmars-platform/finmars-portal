(function () {

    'use strict';

    var getDataForComponentsSelector = function (viewModel, componentsForLinking, itemId) {

        var getComponentsTypesByContentType = function (contentType) {

            var filteredComponentsTypes = viewModel.componentsTypes.filter(function (componentType) {

                return componentType.type === 'control' &&
                    componentType.settings.value_type === 100 &&
                    componentType.settings.content_type === contentType

            });

            return filteredComponentsTypes;

        }

        viewModel.controlComponentsTypes = viewModel.componentsTypes.filter(function (componentType) {
            return componentType.type === 'control';
        });

        viewModel.dateControlComponentsTypes = viewModel.componentsTypes.filter(function (componentType) {
            return componentType.type === 'control' && componentType.settings.value_type === 40
        });

        viewModel.currencyControlComponentsTypes = getComponentsTypesByContentType('currencies.currency');

        viewModel.pricingPolicyControlComponentsTypes = getComponentsTypesByContentType('instruments.pricingpolicy');

        viewModel.portfoliosComponentTypes = getComponentsTypesByContentType('portfolios.portfolio');

        viewModel.accountsComponentTypes = getComponentsTypesByContentType('accounts.account');

        viewModel.strategies1ComponentTypes = getComponentsTypesByContentType('strategies.strategy1');

        viewModel.strategies2ComponentTypes = getComponentsTypesByContentType('strategies.strategy2');

        viewModel.strategies3ComponentTypes = getComponentsTypesByContentType('strategies.strategy3');

        viewModel.componentsTypes.forEach(function (comp) {

            if (componentsForLinking.indexOf(comp.type) !== -1 &&
                comp.id !== itemId) {

                viewModel.componentsForMultiselector.push(
                    {
                        id: comp.id,
                        name: comp.name
                    });

            }

        });

    };

    module.exports = {
        getDataForComponentsSelector: getDataForComponentsSelector
    }

}());