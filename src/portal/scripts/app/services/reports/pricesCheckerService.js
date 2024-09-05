/**
 * Created by szhitenev on 06.11.2020.
 */
import baseUrlService from "../../../../../shell/scripts/app/services/baseUrlService";

export default function (cookieService, xhrService) {

    const baseUrl = baseUrlService.resolve();

    const check = function (data) {

        const prefix = baseUrlService.getMasterUserPrefix();
        const apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'reports/price-history-check/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    const fetchPricesErrors = async function (reportOptions) {

        const data = await check(reportOptions);

        // data.items = data.items.map(function (item) {
        //
        //     if (item.type === 'missing_principal_pricing_history' || item.type === 'missing_accrued_pricing_history') {
        //
        //         data.item_instruments.forEach(function (instrument) {
        //
        //             if (item.id === instrument.id) {
        //                 item.instrument_object = instrument;
        //             }
        //
        //         })
        //
        //     }
        //
        //     if (item.type === 'fixed_calc' || item.type === 'stl_cur_fx' || item.type === 'missing_instrument_currency_fx_rate') {
        //
        //         data.item_currencies.forEach(function (currency) {
        //
        //             if (item.transaction_currency_id === currency.id) {
        //                 item.currency_object = currency;
        //             }
        //
        //             if (item.id === currency.id) {
        //                 item.currency_object = currency;
        //             }
        //
        //         })
        //
        //     }
        //
        //     return item
        //
        // });

        return data;

    }

    return {
        check: check,
        fetchPricesErrors: fetchPricesErrors,
    }

}