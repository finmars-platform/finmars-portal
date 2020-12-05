module.exports = function () {

    function getEnvironmentVariables() {

        var result = {
            apiHost: process.env.API_HOST,
            host: process.env.HOST || 'http://0.0.0.0:8080',
            username: process.env.USERNAME,
            password: process.env.PASSWORD
        }

        console.log('env', result);

        return result;

    }

    async function login(username, password) {

        var authHeader = element(by.css('.auth-header'))
        var usernameInput = element(by.css('.auth-username'));
        var passwordInput = element(by.css('.auth-password'));
        var loginButton = element(by.css('.auth-login'));

        var text = await authHeader.getText()
        expect(text).toEqual('Authentication')
        console.log("Header found. Text " + text)

        usernameInput.sendKeys(username);
        passwordInput.sendKeys(password);
        loginButton.click();

        console.log("Logged in Successfully");
    }

    async function printLogs(){

        browser.manage().logs().get('browser').then(function(browserLog) {
            if (browserLog.length) {
                console.log('Browser console error!');
                console.error('log: ' + JSON.stringify(browserLog));
            }
        });

    }

    return {
        login: login,
        printLogs: printLogs,
        getEnvironmentVariables: getEnvironmentVariables
    }

}