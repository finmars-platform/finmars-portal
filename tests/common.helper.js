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

    function login(username, password) {
        var usernameInput = element(by.css('.auth-username'));
        var passwordInput = element(by.css('.auth-password'));
        var loginButton = element(by.css('.auth-login'));

        usernameInput.sendKeys(username);
        passwordInput.sendKeys(password);
        loginButton.click();
    }

    return {
        login: login,
        getEnvironmentVariables: getEnvironmentVariables
    }

}