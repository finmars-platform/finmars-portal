const fs = require('fs');
const path = require('path');

// Define your environment variables
var API_HOST = process.env.API_HOST || 'http://0.0.0.0:8000';
var WS_HOST = process.env.WS_HOST || 'ws://0.0.0.0:6969';
var HEALTHCHECK_HOST = process.env.HEALTHCHECK_HOST || '';
var AUTHORIZER_URL = process.env.AUTHORIZER_URL || 'http://0.0.0.0:8083/authorizer';
var KEYCLOAK_ACCOUNT_PAGE = process.env.KEYCLOAK_ACCOUNT_PAGE || 'https://stage-auth.finmars.com/realms/finmars/account/';
var KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'https://stage-auth.finmars.com';
var KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'finmars';
var KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'finmars';
var USE_ACTIVENOTE = process.env.USE_ACTIVENOTE || false;


// Function to replace placeholders in config file
function replaceConfigVars(configFilePath) {
    let configData = fs.readFileSync(configFilePath, 'utf8');

    // Replace placeholders with environment variable values
    configData = configData.replace(/__API_HOST__/g, API_HOST.startsWith('http') ? API_HOST : `https://${API_HOST}`);
    configData = configData.replace(/__WS_HOST__/g, WS_HOST);
    configData = configData.replace(/__HEALTHCHECK_HOST__/g, HEALTHCHECK_HOST);
    configData = configData.replace(/__AUTHORIZER_URL__/g, AUTHORIZER_URL);
    configData = configData.replace(/__KEYCLOAK_ACCOUNT_PAGE__/g, KEYCLOAK_ACCOUNT_PAGE);
    configData = configData.replace(/__KEYCLOAK_URL__/g, KEYCLOAK_URL);
    configData = configData.replace(/__KEYCLOAK_REALM__/g, KEYCLOAK_REALM);
    configData = configData.replace(/__KEYCLOAK_CLIENT_ID__/g, KEYCLOAK_CLIENT_ID);
    configData = configData.replace(/__USE_ACTIVENOTE__/g, USE_ACTIVENOTE);
    // ... other replacements

    // Write the modified content back to the file
    fs.writeFileSync(configFilePath, configData);
}

// Path to the source and destination config file
const srcConfigPath = path.join(__dirname, 'src', 'config.js');
const destConfigPath = path.join(__dirname, 'dist', 'config.js');

// Copy the source config file to the destination
fs.copyFileSync(srcConfigPath, destConfigPath);

// Replace placeholders in the copied config file
replaceConfigVars(destConfigPath);

console.log('Config variables replaced in dist/config.js');