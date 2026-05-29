#!/bin/sh

CONFIG_PATH="dist/config.js"

# Define environment variables with defaults
API_HOST="${API_HOST:-http://0.0.0.0:8000}"
WS_HOST="${WS_HOST:-ws://0.0.0.0:6969}"
HEALTHCHECK_HOST="${HEALTHCHECK_HOST:-}"
AUTHORIZER_URL="${AUTHORIZER_URL:-http://0.0.0.0:8083/authorizer}"
KEYCLOAK_ACCOUNT_PAGE="${KEYCLOAK_ACCOUNT_PAGE:-https://stage-auth.finmars.com/realms/finmars/account/}"
KEYCLOAK_URL="${KEYCLOAK_URL:-https://stage-auth.finmars.com}"
KEYCLOAK_REALM="${KEYCLOAK_REALM:-finmars}"
KEYCLOAK_CLIENT_ID="${KEYCLOAK_CLIENT_ID:-finmars}"
USE_ACTIVENOTE="${USE_ACTIVENOTE:-false}"
EDITION_TYPE="${EDITION_TYPE:-enterprise}"
SENTRY_DSN="${SENTRY_DSN:-}"

# Add https:// prefix if API_HOST doesn't start with http
case "$API_HOST" in
    http*) API_HOST_FINAL="$API_HOST" ;;
    *) API_HOST_FINAL="https://$API_HOST" ;;
esac

# Escape special characters for sed
escape_sed() {
    printf '%s\n' "$1" | sed -e 's/[\/&]/\\&/g'
}


# Replace placeholders in the copied config file
sed -i "s|__API_HOST__|$(escape_sed "$API_HOST_FINAL")|g" "$CONFIG_PATH"
sed -i "s|__WS_HOST__|$(escape_sed "$WS_HOST")|g" "$CONFIG_PATH"
sed -i "s|__HEALTHCHECK_HOST__|$(escape_sed "$HEALTHCHECK_HOST")|g" "$CONFIG_PATH"
sed -i "s|__AUTHORIZER_URL__|$(escape_sed "$AUTHORIZER_URL")|g" "$CONFIG_PATH"
sed -i "s|__KEYCLOAK_ACCOUNT_PAGE__|$(escape_sed "$KEYCLOAK_ACCOUNT_PAGE")|g" "$CONFIG_PATH"
sed -i "s|__KEYCLOAK_URL__|$(escape_sed "$KEYCLOAK_URL")|g" "$CONFIG_PATH"
sed -i "s|__KEYCLOAK_REALM__|$(escape_sed "$KEYCLOAK_REALM")|g" "$CONFIG_PATH"
sed -i "s|__KEYCLOAK_CLIENT_ID__|$(escape_sed "$KEYCLOAK_CLIENT_ID")|g" "$CONFIG_PATH"
sed -i "s|__USE_ACTIVENOTE__|$(escape_sed "$USE_ACTIVENOTE")|g" "$CONFIG_PATH"
sed -i "s|__EDITION_TYPE__|$(escape_sed "$EDITION_TYPE")|g" "$CONFIG_PATH"
sed -i "s|__SENTRY_DSN__|$(escape_sed "$SENTRY_DSN")|g" "$CONFIG_PATH"

echo "Config variables replaced in dist/config.js"