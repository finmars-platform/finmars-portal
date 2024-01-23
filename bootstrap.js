// 2024-01-12 szhitenev update start
// migration from gulp to vite
import $ from 'jquery/dist/jquery.js';
window.jQuery = window.$ = $;

import moment from 'moment';
window.moment = moment
import 'angular';
import 'angular-sanitize';
import 'angular-aria';
import 'angular-material';
import 'angular-material/angular-material.css';
import 'angular-messages';
import 'angular-material-icons';
import 'angular-material-icons/angular-material-icons.js';
import 'angular-material-icons/angular-material-icons.css';
import './src/core/content/css/material-icons.css';
import 'angular-resource';
// import 'angular-ui-router';
import 'angular-ui-router/release/angular-ui-router.js';
import 'angular-animate';

import 'dragula/dist/dragula.css';
import dragula from 'dragula/dist/dragula.js';
window.dragula = dragula;

import './src/core/keycloak/keycloak.js';

// import './src/profile/scripts/app/services/baseUrlService.js';



import pickmeup from './src/core/datepicker/pickmeup.js'
window.pickmeup = pickmeup;
import 'pickmeup/css/pickmeup.css'

import toastr from 'toastr/build/toastr.min.js';
import 'toastr/build/toastr.css';
window.toastr = toastr;

import jsondiffpatch from 'jsondiffpatch/dist/jsondiffpatch.umd.js'
import 'jsondiffpatch/dist/formatters-styles/annotated.css';
import 'jsondiffpatch/dist/formatters-styles/html.css';
window.jsondiffpatch = jsondiffpatch;

import './src/core/ace/ace.js';
import './src/core/ace/ext-language_tools.js';
import './src/core/ace/ext-searchbox.js';
import './src/core/ace/mode-json.js';
import './src/core/ace/mode-yaml.js';
import './src/core/ace/mode-python.js';
import './src/core/ace/mode-css.js';
import './src/core/ace/mode-html.js';
import './src/core/ace/mode-javascript.js';
import './src/core/ace/theme-monokai.js';


import 'jstree/dist/jstree.js'
import 'jstree/dist/themes/default/style.css'
// import './src/core/tsparticles/tsparticles.engine.min.js';
// import './src/core/tsparticles/tsparticles.move.base.min.js';
// import './src/core/tsparticles/tsparticles.preset.stars.min.js';
// import './src/core/tsparticles/tsparticles.shape.circle.min.js';
// import './src/core/tsparticles/tsparticles.updater.color.min.js';
// import './src/core/tsparticles/tsparticles.updater.opacity.min.js';
// import './src/core/tsparticles/tsparticles.updater.out-modes.min.js';
// import './src/core/tsparticles/tsparticles.updater.size.min.js';

import './src/shell/scripts/main.js'

import './src/portal/content/less/imports.less';