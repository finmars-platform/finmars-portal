(function () {

    let lastId = 1;

    function BigDrawerService($rootScope, $templateCache, $compile, $controller) {

        this.rootElement = document.body;

        let _this = this;


        _this._id = 'root';

        _this.drawersPromise = null;

        let backdropElem, drawerElem, drawerWrap, drawerContainer, drawerPin;
		let sidenavWidth = 330, viewportWidth, drawerMaxWidth, currentWidthPercent = 100, drawerCurrentWidth, drawerHeight,
			drawerWidthAnimationDuration = 500; // same as width transition duration

		let calcDrawerContainerSize = function () {

			viewportWidth = window.innerWidth;
			drawerMaxWidth = (viewportWidth - sidenavWidth) * 0.9;
            drawerCurrentWidth = drawerMaxWidth * currentWidthPercent / 100;
			drawerHeight = window.innerHeight;

			drawerContainer.style.width = drawerCurrentWidth + 'px';
			drawerContainer.style.height = drawerHeight + 'px';

		};

		function bigDrawerOnWindowResize () {

			calcDrawerContainerSize();

			// drawerWrap.classList.add('no-drawer-animation');
			drawerWrap.style.width = drawerCurrentWidth + 'px';
			/* setTimeout(function () {
				drawerWrap.classList.remove('no-drawer-animation');
			}, drawerWidthAnimationDuration); */

		}

		function setWidthPercent (percent = 100) {
		    currentWidthPercent = percent
            drawerCurrentWidth = drawerMaxWidth * currentWidthPercent / 100;

            drawerContainer.style.width = drawerCurrentWidth + 'px';
            drawerWrap.style.width = drawerCurrentWidth + 'px';
        }

        this.setWidthPercent = setWidthPercent;

		function showPin (isShowPin) {

		    if (!drawerPin) {
		        return ;
            }

		    if (isShowPin) {
		        drawerPin.classList.remove('display-none');
		        drawerPin.classList.add('display-block');
            } else {
                drawerPin.classList.add('display-none');
                drawerPin.classList.remove('display-block');
            }

        }

		this.showPin = showPin;

        this.show = function (options) {

            return new Promise(function (resolve, reject) {

                let tpl;
                let templateScope;
                let ctrl;

                tpl = $templateCache.get(options.templateUrl);

                templateScope = $rootScope.$new();

                let defaultLocals = {
                    $scope: templateScope,
                    $customDialog: Object.assign({}, _this, {_id: lastId})
                };

                let locals = Object.assign(defaultLocals, options.locals);

                ctrl = $controller(options.controller, locals);


                /* let viewportWidth = window.innerWidth;
                let drawerWidth = (viewportWidth - sidenavWidth) * 0.9;
                let drawerHeight = window.innerHeight; */

                backdropElem = document.createElement('div');
                backdropElem.classList.add('big-drawer-backdrop');

                drawerElem = document.createElement('div');
                drawerElem.classList.add('big-drawer-div');

                drawerWrap = document.createElement('div'); // used for opening / closing drawer animation
                drawerWrap.classList.add('big-drawer-wrap', 'big-drawer-opens');
                drawerElem.appendChild(drawerWrap);

                drawerContainer = document.createElement('div');
                drawerContainer.classList.add('big-drawer-container');

                drawerPin = document.createElement('div');
                drawerPin.classList.add('big-drawer-pin');
                drawerPin.innerHTML = `<ng-md-icon icon="keyboard_arrow_left"></ng-md-icon>`

				calcDrawerContainerSize();
				if (options.widthPercent) {
				    setWidthPercent(options.widthPercent);
                }
                drawerWrap.appendChild(drawerContainer);

                $(drawerContainer).html(tpl);
                $(drawerContainer).children().data('$ngControllerController', ctrl);

                drawerPin = document.createElement('div');
                drawerPin.classList.add('big-drawer-pin');
                drawerPin.innerHTML = `<ng-md-icon icon="keyboard_arrow_left"></ng-md-icon>`
                showPin(options.showPin);
                $(drawerContainer).append(drawerPin)

                if (options.onPinClickCallback) {
                    drawerPin.addEventListener('click', options.onPinClickCallback)
                }

                // in case of multiple drawers
                /*let firstChild = $(drawerElem).contents()[0];

                $(firstChild).addClass('custom-dialog-id-' + lastId);*/

                $compile($(drawerElem).contents())(templateScope);

                $(_this.rootElement).addClass('overflow-hidden');
                //$(_this.rootElement).append($(elem).contents());
                $(_this.rootElement).append($(backdropElem), $(drawerElem));

                /* setTimeout(function () {

                     drawerWrap.style.width = drawerWidth + 'px';

                    setTimeout(function () { // remove overflow: hidden; at the end of animation
                        drawerWrap.style.overflow = 'visible';
                    }, drawerWidthAnimationDuration);

                }, 50); */

                _this.drawersPromise = resolve;

                //lastId = lastId + 1;

				window.addEventListener("resize", bigDrawerOnWindowResize);

            })

        };

        this.hide = function (data) {

            /* drawerWrap.style.overflow = '';
            drawerWrap.style.width = ''; */
			drawerWrap.classList.remove('big-drawer-opens');
			drawerWrap.classList.add('big-drawer-closes');

			window.addEventListener("resize", bigDrawerOnWindowResize);

            setTimeout(function () {

                drawerElem.remove();
                backdropElem.remove();

                $(_this.rootElement).removeClass('overflow-hidden');

            }, 500);

			window.removeEventListener("resize", bigDrawerOnWindowResize);

            let resolve = _this.drawersPromise;

            resolve(data);

        }

    }

    module.exports = function ($rootScope, $templateCache, $compile, $controller) {

        let service = new BigDrawerService($rootScope, $templateCache, $compile, $controller);

        return {
            show: service.show,
            hide: service.hide,
            setWidthPercent: service.setWidthPercent,
            showPin: service.showPin
        }

    }


}());