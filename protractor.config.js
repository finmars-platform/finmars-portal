exports.config = {
    directConnect: true,

    framework: 'jasmine2',

    specs: [
        'tests/*.js'
    ],

    baseUrl: 'http://localhost:8000/',

    capabilities: {
        browserName: 'chrome',
        maxInstances: 1,
        chromeOptions: {
            args: [ "--headless", "--disable-gpu", "--window-size=800,600", "--no-sandbox"]
        }
    }
};