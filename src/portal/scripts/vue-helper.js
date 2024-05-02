import { createApp, h } from 'vue';


export function vueClassConverter(VueComponent) {

    return function($rootScope) {
        return {
            restrict: 'E',
            transclude: true,  // Allow content to be transcluded
            scope: {
                onClick: '&?', // Allow passing an optional click handler
            },
            link: function(scope, element, attrs, ctrl, transclude) {
                const props = {};
                // Copy valid props and ignore AngularJS-specific attributes
                Object.keys(attrs).forEach(key => {
                    if (key[0] !== '$' && key !== 'class' && typeof attrs[key] === 'string') {
                        props[key] = attrs[key];
                    }
                });

                // Initialize Vue app
                const VueApp = createApp({
                    render() {
                        return h(VueComponent, {
                            class: attrs['class'],  // Pass class attribute
                            ...props,
                        }, this.$slots.default);
                    },
                    mounted() {
                        // Handle transclusion by appending AngularJS transcluded content
                        transclude(scope, (clone) => {
                            this.$el.appendChild(clone[0]);
                        });
                    }
                });

                const vueInstance = VueApp.mount(element[0]);

                // Cleanup
                scope.$on('$destroy', () => {
                    if (vueInstance) {
                        vueInstance.unmount();
                    }
                    element.off('click');  // Remove event listener
                });
            }
        };
    };
}