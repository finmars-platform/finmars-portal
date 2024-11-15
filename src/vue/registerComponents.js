import { h, reactive, createApp } from 'vue';
import {createVuetify} from 'vuetify';
import {FmNavigationPortal, FmHeader} from "@finmars/ui";


const vuetify = createVuetify();

function registerVueComponentAsCustomElement(tagName, component) {
    class VueCustomElement extends HTMLElement {
        static get observedAttributes() {
            return Object.keys(component.props || {}).map(prop => camelToKebabCase(prop));
        }

        constructor() {
            super();
            this.app = null;
            this.props = {};
        }

        connectedCallback() {
            this.updateProps();

            if (!this.app) {
                this.props = reactive(this.props);

                let emittedEvents = [];
                if (component.emits) {
                    if (Array.isArray(component.emits)) {
                        emittedEvents = component.emits;
                    } else if (typeof component.emits === 'object') {
                        emittedEvents = Object.keys(component.emits);
                    }
                }

                const eventHandlers = {};
                emittedEvents.forEach(eventName => {
                    eventHandlers['on' + capitalizeFirstLetter(eventName)] = (...args) => {
                        this.dispatchCustomEvent(eventName, args.length > 1 ? args : args[0]);
                    };
                });

                this.app = createApp({
                    render: () => h(component, {
                        ...this.props,
                        ...eventHandlers
                    }),
                });

                this.app.use(vuetify);
                this.app.mount(this);
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            this.updateProp(kebabToCamelCase(name), newValue);
        }

        disconnectedCallback() {
            if (this.app) {
                this.app.unmount();
                this.app = null;
            }
        }

        updateProps() {
            const propDefs = component.props || {};
            for (let propName of Object.keys(propDefs)) {
                const attrValue = this.getAttribute(camelToKebabCase(propName));
                this.props[propName] = this.castAttributeValue(attrValue, propDefs[propName]);
            }
        }

        updateProp(name, value) {
            const propDef = component.props[name];
            if (propDef) {
                this.props[name] = this.castAttributeValue(value, propDef);
            }
        }

        castAttributeValue(value, propDef) {
            let type;

            if (typeof propDef === 'function') {
                type = propDef;
            } else if (typeof propDef === 'object' && propDef !== null && propDef.type) {
                type = propDef.type;
            } else {
                type = null;
            }

            if (value === null) {
                if (type === Boolean) {
                    return false;
                } else if (propDef && propDef.hasOwnProperty('default')) {
                    return typeof propDef.default === 'function' ? propDef.default() : propDef.default;
                } else {
                    return undefined;
                }
            }

            switch (type) {
                case Boolean:
                    return value === '' || value.toLowerCase() === 'true';
                case Number:
                    return Number(value);
                case Array:
                case Object:
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        console.warn(`The attribute "${value}" could not be converted in ${type.name}`);
                        return value;
                    }
                case String:
                    return value;
                default:
                    return value;
            }
        }

        dispatchCustomEvent(eventName, value) {
            this.dispatchEvent(new CustomEvent(eventName, {
                detail: value,
                bubbles: true,
                composed: true
            }));
        }
    }

    customElements.define(tagName, VueCustomElement);
}

function camelToKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function kebabToCamelCase(str) {
    return str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
}


export default function registerVueComponents() {
    registerVueComponentAsCustomElement('fm-navigation-portal', FmNavigationPortal);
    registerVueComponentAsCustomElement('fm-header', FmHeader);
}