
var CommonHelper = require('./common.helper')

describe('homepage', function() {

    var commonHelper = new CommonHelper();
    var env = commonHelper.getEnvironmentVariables();

    beforeEach(function() {

        browser.driver.get(env.host + '/#/');

        commonHelper.login(env.username, env.password);

    });

    it('check master user name', async function() {

        await browser.sleep(5000);
        console.log("sleep 5000")

        var masterUserName = element(by.css('.header-masteruser-name'));

        masterUserName.getText().then(function(text) {

            console.log('Master user name', text);

            expect(text.length).not.toEqual(0)
        })

    });

    afterEach(function (){

        browser.manage().logs().get('browser').then(function(browserLog) {
            if (browserLog.length) {
                console.log('Browser console error!');
                console.error('log: ' + JSON.stringify(browserLog));
            }
        });

    })

});