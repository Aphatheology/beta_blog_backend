const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const Users = require("./user.model");

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async function (email) {
    const user = await Users.findOne({ email });
    return !!user;
};

const register = async (userBody) => {
    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    const user = await Users.create(userBody);
    const token = user.createJWT();
    return { user, token };
};

const login = async (userBody) => {
    const user = await Users.findOne({ email: userBody.email }).select('+password');

	if (!user || !(await user.correctPassword(userBody.password, user.password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}
    const token = user.createJWT();
    
    return { user, token };
};

module.exports = {
    register,
    login,
};
