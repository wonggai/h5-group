import AsyncValidator from 'async-validator';
const noop = function () {};

export default {
    validateField (rules, prop, value, callback = noop) {
        if ((!rules || rules.length === 0)) {
            callback();
            return true;
        }
        let validateMessage = '';
        const descriptor = {};
        
        descriptor[prop] = rules;
        const validator = new AsyncValidator(descriptor);
        const model = {};
        model[prop] = value;
        validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
            validateMessage = errors ? errors[0].message : '';
            callback(validateMessage, invalidFields);
        });
    },
    validate (dataSource, rules) {
        let callback = noop;
        let rulesKeys = (rules && Object.keys(rules)) || [];
        let valid = true;
        let promise = new Promise((resolve, reject) => {
            callback = function (valid, message) {
                valid ? resolve(valid) : reject(new Error(message));
            };
        })

        rulesKeys.find((prop, fieldIndex) => {
            let ruleItem = rules[prop];
            let value = dataSource[prop];
            if (!valid) {
                return prop
            } else {
                this.validateField(ruleItem, prop, value, (message, invalidFields) => {
                    if (message) {
                        valid = false;
                        callback(valid, message);
                    }
                    if (typeof callback === 'function' && ++fieldIndex === rulesKeys.length) {
                        callback(valid, invalidFields);
                    }
                });
            }
        })
        return promise;
    },
}
