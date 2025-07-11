\# Portal

### Installation

1) Clone project

`git clone git@gitlab.finmars.com:finmars/portal.git`

1) Install all dependencies

`npm install`

2) Run local Web Server

2.1) Proxy requests to one of finmars backends for development

`REALM=realm00000 DATABASE_ID=space00000 node server-proxy`

replace `realm00000` and `space00000` with the ones that will be used

2.2) When using locally deployed backend

`node server-local`

3) Build project

#### Important Disclaimer GULP is Deprecated, since 2024-01-14 it Migrated to Vite
https://vitejs.dev/

If using server-proxy.js

`PROJECT_ENV=local API_HOST=http://0.0.0.0:8080 AUTHORIZER_URL=http://0.0.0.0:8080/authorizer npm run build-local` - for MAC and Linux

`set PROJECT_ENV=local set API_HOST=http://localhost:8080 set AUTHORIZER_URL=http://0.0.0.0:8080/authorizer` - for windows

If using server.js and a locally deployed backend

`PROJECT_ENV=local API_HOST=http://0.0.0.0:8000 AUTHORIZER_URL=http://0.0.0.0:8083/authorizer npm run build-local` - for MAC and Linux

4) How to run tests

`HOST=http://0.0.0.0:8080/ USERNAME=user PASSWORD=pass protractor protractor.config.js`


### Repository structure:

`./gulptasks` - config files for gulp compiler

`./dist` - autogenerated folder with built code

`./docs` - autogenerated folder with docs by jsdoc

`./src` - folder with all source code

`./libs` - backup folder with all libraries.

`./server.js` - server file

`./server-proxy.js` - server file with proxy to dev server

`./Gulpfile` - configuration file for Gulp compiler

`./package.json` - json file with all project description (dependencies, commands, version etc)

`./Dockerfile` - config file that converts project to a Docker image

`./changelog.md` - file tha contains helpful messages of changes in project. Put here a note of any major change before commit


### FAQ:

- **How project is structured?**   
We are using MVC approach. Here is brief explanation.  
View - angular html template. Only stored in `./src/portal/scripts/app/views`  
Controller - javascript code that directly attached to template. Angular depended. Stored in `./src/portal/scripts/app/controllers`  
Model just a list of fields. Models do not have logic inside them. Location `./src/prtal/scripts/app/models`  
Service - javascript code that has logic related to data/events. Used in controllers.  Location `./src/prtal/scripts/app/services`  
Repository - javascript code contains XHR requests to REST API.  Location `./src/prtal/scripts/app/repositories`  
Directive - angular specific files. Basically components.  Location `./src/prtal/scripts/app/directives`  
Helper - some utility code that can be shared across multiple services.  Location `./src/prtal/scripts/app/helpers`

- **What is Core and Portal folders?**  
Our source code placed in `portal` folder. `core` contains libraries/external code


### Keycloak Help
https://github.com/keycloak/keycloak-documentation/blob/main/securing_apps/topics/oidc/javascript-adapter.adoc
https://stackoverflow.com/questions/52040265/how-to-specify-refresh-tokens-lifespan-in-keycloak
https://keycloak.discourse.group/t/issue-on-userinfo-endpoint-at-keycloak-20/18461/4

### Local Development CORS error.

chrome://flags/#block-insecure-private-network-requests

P.S. https://stackoverflow.com/questions/66534759/cors-error-on-request-to-localhost-dev-server-from-remote-site


INSTALLATION_TYPE = community | enterprise


## License
Please refer to the [LICENSE](https://github.com/finmars-platform/finmars-portal/blob/main/LICENSE.md) file for a copy of the license.


## Support
Please use the GitHub issues for support, feature requests and bug reports, or contact us by sending an email to support@finmars.com.
