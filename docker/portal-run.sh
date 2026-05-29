echo "Portal initialization"

#node node_modules/gulp/bin/gulp.js after-build-env-set
#node copy-config.js
envsubst < public/config.js.template > public/config.js

node ./server.js