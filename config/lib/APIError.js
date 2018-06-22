'use strict';

/**
 * @extends Error
 */
class ExtendableError extends Error {
    constructor(messageObj, status) {
        let message,
            messageInfo;
        if (messageObj instanceof Object) {
            message = messageObj.code;
            message = messageObj.messageInfo;
        } else {
            message = messageObj;
        }

        super(message);

        this.name = this.constructor.name;
        this.code = message;
        this.messageInfo = messageInfo;
        this.status = status;
        Error.captureStackTrace(this, this.constructor.name);
    }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {string, object} messageObj - Error Object.
     * @param {number} status - HTTP status code of error.
     */
    constructor(messageObj, status = 500) {
        super(messageObj, status);
    }
}

module.exports = APIError;