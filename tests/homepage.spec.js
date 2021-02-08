
var CommonHelper = require('./common.helper')

describe('homepage', function() {

    var commonHelper = new CommonHelper();
    var env = commonHelper.getEnvironmentVariables();

    beforeEach(async function() {

        browser.driver.get(env.host + '/#/');

        await commonHelper.printLogs();

        await commonHelper.login(env.username, env.password);

        commonHelper.printCookies();

    });

    it('check master user name', async function() {

        await browser.sleep(10000);
        console.log("sleep 10000")

        var masterUserName = element(by.css('.header-masteruser-name'));

        masterUserName.getText().then(function(text) {

            console.log('Master user name', text);

            expect(text.length).not.toEqual(0)
        })

    });

    afterEach(async function (){

       await commonHelper.printLogs();

    })

});