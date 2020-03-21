const CODES = {
	NOT_CONNECT_DATABASE: 1
};
const messages = {
	[CODES.NOT_CONNECT_DATABASE]: {
		status: 401,
		message: `Not connect database`
	}
};

class ApiError extends Error {
	constructor(code = 9000, ...params) {
		super();

		this.code = code;
		this.status = messages[code].status;
		this.message = typeof messages[code].message === 'function'
			? messages[code].message(...params)
			: messages[code].message;

		return this;
	}

	static get CODES() {
		return CODES;
	}
}

module.exports = ApiError;