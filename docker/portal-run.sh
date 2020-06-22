echo "Portal initialization"

node node_modules/gulp/bin/gulp.js after-build-env-set

node ./server.js