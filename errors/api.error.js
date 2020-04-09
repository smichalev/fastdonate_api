const CODES = {
  UNKNOWN_ERROR: 0,
  NOT_CORRECT_QUERY: 1,
  NOT_CONNECT_DATABASE: 2,
  USER_NOT_FOUND: 3,
  INVALID_PARAMETERS: 4,
  NOT_FOUND: 5,
  SCRIPT_NOT_FOUND: 6,
  NOT_ENOUGH_RIGHTS: 7,
  PAGE_NOT_FOUND: 8,
  REQUIRED_FIELD_IS_NOT_FILLED: 9,
  INVALID_PRODUCT_PRICE: 10,
  MANY_HASHTAG: 16,
  INVALID_DISCOUNT_PERCENTAGE: 11,
  AVAILABLE_FOR_AUTHORIZED_USERS_ONLY: 12,
  TOKEN_NOT_VALID: 13,
  YOU_ARE_NOT_LOGIN: 14,
  SESSION_DIE: 15,
  INVALID_ATTACHMENT_FORMAT: 16,
  POST_VERY_OFTEN: 17,
  VERY_LARGE_COMMENT: 18
};
const messages = {
  [CODES.UNKNOWN_ERROR]: {
    status: 500,
    message: `Unknown error`
  },
  [CODES.NOT_CORRECT_QUERY]: {
    status: 400,
    message: `Not correct query API`
  },
  [CODES.NOT_CONNECT_DATABASE]: {
    status: 500,
    message: `Not connect database`
  },
  [CODES.USER_NOT_FOUND]: {
    status: 404,
    message: `User not found`
  },
  [CODES.INVALID_PARAMETERS]: {
    status: 400,
    message: `Invalid parameters`
  },
  [CODES.NOT_FOUND]: {
    status: 404,
    message: `Not found`
  },
  [CODES.SCRIPT_NOT_FOUND]: {
    status: 404,
    message: `Script not found`
  },
  [CODES.NOT_ENOUGH_RIGHTS]: {
    status: 400,
    message: `Not enough rights for action`
  },
  [CODES.PAGE_NOT_FOUND]: {
    status: 404,
    message: `Page not found, maybe she will appear in the future...`
  },
  [CODES.REQUIRED_FIELD_IS_NOT_FILLED]: {
    status: 400,
    message: `Required field is not filled`
  },
  [CODES.INVALID_PRODUCT_PRICE]: {
    status: 400,
    message: `Invalid product price`
  },
  [CODES.MANY_HASHTAG]: {
    status: 400,
    message: `Too many hashtags`
  },
  [CODES.INVALID_DISCOUNT_PERCENTAGE]: {
    status: 400,
    message: `Invalid discount percentage`
  },
  [CODES.AVAILABLE_FOR_AUTHORIZED_USERS_ONLY]: {
    status: 401,
    message: `Available for authorized users only`
  },
  [CODES.TOKEN_NOT_VALID]: {
    status: 401,
    message: `Token not valid, please do authorization again`
  },
  [CODES.YOU_ARE_NOT_LOGIN]: {
    status: 401,
    message: `Your are not logged in`
  },
  [CODES.SESSION_DIE]: {
    status: 401,
    message: `Session over, please re-authorize`
  },
  [CODES.INVALID_ATTACHMENT_FORMAT]: {
    status: 400,
    message: `Invalid attachment format`
  },
  [CODES.POST_VERY_OFTEN]: {
    status: 400,
    message: `You post very often`
  },
  [CODES.VERY_LARGE_COMMENT]: {
    status: 400,
    message: `The maximum length of the comment should not exceed 180 characters`
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