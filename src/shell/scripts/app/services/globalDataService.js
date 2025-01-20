'use strict';
/** @module globalDataService */
export default function () {

    let userHaveCurrentMasterUser = false;

    let data = {
        masterUser: null,
        member: null,
        memberLayout: null,
        user: null,
        whiteLabel: null,
    };

    let iframeMode = false; // used when app inside iframe

    const doUserHasCurrentMasterUser = function () {
        return userHaveCurrentMasterUser;
    };

    /**
     * Set whether user has current master user.
     *
     * @memberOf module:globalDataService
     * @param currentMasterUserIsSet {boolean}
     */
    const setCurrentMasterUserStatus = function (currentMasterUserIsSet) {
        userHaveCurrentMasterUser = currentMasterUserIsSet;
    };

    var _paq

    const setUser = function (user) {

        if (!user.data) user.data = {};

        if (typeof user.data.autosave_layouts !== 'boolean') {
            user.data.autosave_layouts = true;
        }

        function getCodesFromUrl() {
            var urlPath = window.location.pathname; // Get the path part of the URL
            var pathParts = urlPath.split('/'); // Split by "/"

            // Ensure the path has enough parts to extract realm_code and space_code
            var realmCode = pathParts[1] || null; // The first segment after "/"
            var spaceCode = pathParts[2] || null; // The second segment after "/"

            return { realmCode, spaceCode };
        }

        if (!_paq) {

            _paq = window._paq = window._paq || [];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */



            // Consider more unique id across spaces

            let prefix = 'eu-central'

            if (window.location.href.indexOf('0.0.0.0') !== -1) {
                prefix = 'local'
            }

            let pieces = window.location.host.split('.')

            if (pieces.length === 3) {
                prefix = pieces[0]
            }

            (function() {
                var u="//analytics.finmars.com/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                // _paq.push(['setSiteId', prefix]);
                _paq.push(['setSiteId', 1]);

                var codes = getCodesFromUrl();

                // If codes exist, set them as custom dimensions
                if (codes.realmCode && codes.spaceCode) {
                    _paq.push(['setCustomDimension', 1, codes.realmCode]); // Set realm_code (Dimension ID 1)
                    _paq.push(['setCustomDimension', 2, codes.spaceCode]); // Set space_code (Dimension ID 2)
                }

                _paq.push(['setUserId', user.username]);
                const hash = window.location.hash.substr(3); // Remove the `#`

                var currentUrl = `${location.origin}${location.pathname}${hash}`; // Build the new clean URL

                // _paq.push(['setReferrerUrl', currentUrl]);
                // currentUrl = '/' + window.location.hash.substr(1);
                _paq.push(['setCustomUrl', currentUrl]);
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);

                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();



        }

        data.user = user;
    };

    const getUser = () => {
        return data.user;
    };

    const setMasterUser = function (masterUser) {
        data.masterUser = masterUser;
    };

    const getMasterUser = () => {
        return data.masterUser;
    };

    const setMember = function (member) {
        // console.trace("autosave77 setMember");
        // console.log("autosave77 setMember", member);
        /*if ( typeof member.data.autosave_layouts !== 'boolean' ) {
            member.data.autosave_layouts = true;
        }*/

        data.member = member;
    };

    const getMember = () => {
        return data.member;
    };

    const setUpMemberData = (member, viewerType, entityType) => {

        if (!member.data) member.data = {};
        if (!member.data.group_tables) member.data.group_tables = {};

        if (!member.data.group_tables.entity_viewer) {
            member.data.group_tables.entity_viewer = {
                entity_viewers_settings: {}
            };
        }

        if (!member.data.group_tables.report_viewer) {
            member.data.group_tables.report_viewer = {
                entity_viewers_settings: {}
            };
        }

        let entityTypesSettings = member.data.group_tables[viewerType].entity_viewers_settings;

        if (!entityTypesSettings[entityType]) {

            entityTypesSettings[entityType] = {
                marked_rows: {},
                row_type_filter: 'none'
            };

        }

        return member;

    };

    const getMemberEntityViewersSettings = (isReport, entityType) => {

        const viewerType = isReport ? 'report_viewer' : 'entity_viewer';
        let member = setUpMemberData(data.member, viewerType, entityType);

        return JSON.parse(JSON.stringify(member.data.group_tables[viewerType].entity_viewers_settings[entityType]));

    };

    const setMemberEntityViewersSettings = function (settings, isReport, entityType) {

        const viewerType = isReport ? 'report_viewer' : 'entity_viewer';
        let member = setUpMemberData(data.member, viewerType, entityType);

        member.data.group_tables[viewerType].entity_viewers_settings[entityType] = settings;

    };

    const setMemberLayout = function (layout) {
        data.memberLayout = layout;
    }

    const getMemberLayout = () => data.memberLayout;

    const isAutosaveLayoutOn = function () {

        const user = getUser();
        const memberLayout = getMemberLayout();

        if (!memberLayout) {
            throw "Method should be called after getting member layout"
        }

        if (!memberLayout.data) memberLayout.data = {};

        const autosave77 = user.data.autosave_layouts && memberLayout.data.autosave_layouts;

        if (!autosave77) {
            console.log("autosave77 isAutosaveLayoutOn user, memberLayout", user, memberLayout);
        }

        return autosave77;

    };

    const clearAllData = function () {

        userHaveCurrentMasterUser = false;

        for (const prop in data) {
            data[prop] = null;
        }

    };

    const setIframeMode = function (modeStatus) {
        iframeMode = modeStatus;
    }

    const insideIframe = function () {
        return iframeMode;
    }

    const getDefaultConfigurationCode = function () {

        return 'local.poms.' + data.masterUser.base_api_url

    }

    const getWhiteLabel = function () {
        return data.whiteLabel
    }

    const setWhiteLabel = function (whiteLabel) {
        data.whiteLabel = whiteLabel
    }

    return {
        setCurrentMasterUserStatus: setCurrentMasterUserStatus,
        doUserHasCurrentMasterUser: doUserHasCurrentMasterUser,

        setUser: setUser,
        getUser: getUser,
        setMasterUser: setMasterUser,
        getMasterUser: getMasterUser,
        setMember: setMember,
        getMember: getMember,
        getMemberEntityViewersSettings: getMemberEntityViewersSettings,
        setMemberEntityViewersSettings: setMemberEntityViewersSettings,
        setMemberLayout: setMemberLayout,
        getMemberLayout: getMemberLayout,

        isAutosaveLayoutOn: isAutosaveLayoutOn,

        clearAllData: clearAllData,

        setIframeMode: setIframeMode,
        insideIframe: insideIframe,

        getWhiteLabel: getWhiteLabel,
        setWhiteLabel: setWhiteLabel,

        getDefaultConfigurationCode: getDefaultConfigurationCode,

        setTheme: function (theme) {
            data.user.data.theme = theme

            document.body.dataset.theme = data.user.data.theme;


        },
        getTheme: function () {
            return data.user.data.theme
        },

        enableThemeDarkMode() {
            data.user.data.dark_mode = true
            document.body.classList.add('dark-mode'); // TODO probably should be moved to some other place?
            document.body.classList.remove('light-mode'); // TODO probably should be moved to some other place?

            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        },

        disableThemeDarkMode() {
            data.user.data.dark_mode = false
            document.body.classList.remove('dark-mode'); // TODO probably should be moved to some other place?
            document.body.classList.add('light-mode'); // TODO probably should be moved to some other place?

            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        },

        isThemeInDarkMode() {
            return data.user.data?.dark_mode || false;
        }
    }

};