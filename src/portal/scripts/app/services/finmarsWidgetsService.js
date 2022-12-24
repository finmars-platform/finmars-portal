
export default function (xhrService) {

    const getFinmarsWidgetsClass = function () {
        /*return new Promise(async (resolve, reject) => {

            xhrService.fetch('https://finmars.com/v/finmarsWidgets.js', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }

            })
            .then(res => {
                resolve(res.json());

            }).catch(e => { reject(e) });

        })*/

        return xhrService.fetch('https://finmars.com/v/finmarsWidgets.js', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        });

    };

    return {
        getFinmarsWidgetsClass: getFinmarsWidgetsClass,
    }

}