(function () {

    var lastId = 1;

    function BigDrawerService($rootScope, $templateCache, $compile, $controller) {

        this.rootElement = document.body;

        var _this = this;


        _this._id = 'root';

        _this.drawersPromise = null;

        var backdropElem, drawerElem, drawerWrap, drawerContainer;

        this.show = function (options) {

            return new Promise(function (resolve, reject) {

                var tpl;
                var templateScope;
                var ctrl;

                tpl = $templateCache.get(options.templateUrl);

                templateScope = $rootScope.$new();

                var defaultLocals = {
                    $scope: templateScope,
                    $customDialog: Object.assign({}, _this, {_id: lastId})
                };

                var locals = Object.assign(defaultLocals, options.locals);

                ctrl = $controller(options.controller, locals);


                var viewportWidth = window.innerWidth;
                var sidenavWidth = 330;
                var drawerWidth = (viewportWidth - sidenavWidth) * 0.9;
                var drawerHeight = window.innerHeight;

                backdropElem = document.createElement('div');
                backdropElem.classList.add('big-drawer-backdrop');

                drawerElem = document.createElement('div');
                drawerElem.classList.add('big-drawer-div');

                drawerWrap = document.createElement('div');
                drawerWrap.classList.add('big-drawer-wrap');
                drawerElem.appendChild(drawerWrap);

                drawerContainer = document.createElement('div');
                drawerContainer.classList.add('big-drawer-container');
                drawerContainer.style.width = drawerWidth + 'px';
                drawerContainer.style.height = drawerHeight + 'px';
                drawerWrap.appendChild(drawerContainer);

                $(drawerContainer).html(tpl);
                $(drawerContainer).children().data('$ngControllerController', ctrl);

                // in case of multiple drawers
                /*var firstChild = $(drawerElem).contents()[0];

                $(firstChild).addClass('custom-dialog-id-' + lastId);*/

                $compile($(drawerElem).contents())(templateScope);

                $(_this.rootElement).addClass('overflow-hidden');
                //$(_this.rootElement).append($(elem).contents());
                $(_this.rootElement).append($(backdropElem), $(drawerElem));

                setTimeout(function () {

                    drawerWrap.style.width = drawerWidth + 'px';

                    setTimeout(function () {
                        drawerWrap.style.overflow = 'visible';
                    }, 500);

                }, 50);

                _this.drawersPromise = resolve;

                //lastId = lastId + 1;

            })

        };

        this.hide = function (data) {

            //var elem = _this.rootElement.querySelector('.custom-dialog-id-' + this._id);
            drawerWrap.style.overflow = '';
            drawerWrap.style.width = '';

            setTimeout(function () {

                drawerElem.remove();
                backdropElem.remove();

                $(_this.rootElement).removeClass('overflow-hidden');

            }, 500);

            var resolve = _this.drawersPromise;

            resolve(data);

        }

    }

    module.exports = function ($rootScope, $templateCache, $compile, $controller) {

        var service = new BigDrawerService($rootScope, $templateCache, $compile, $controller);

        return {
            show: service.show,
            hide: service.hide
        }

    }


}());