const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Users = require("./user.model");

const isEmailTaken = async function (email) {
    const user = await Users.findOne({ email });
    return !!user;
};

const isUsernameTaken = async function (username) {
    const user = await Users.findOne({ username });
    return !!user;
};

const register = async (userBody) => {
    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    if (await isUsernameTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
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

const createUser = async (user, userBody) => {
    if (user.role !== 'admin') {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
	}

    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    if (await isUsernameTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
    }

    const newUser = await Users.create(userBody);
    return newUser;
};

const getAllUsers = async (user) => {
    if (user.role !== 'admin') {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
	}

    const users = await Users.find();

    return users;
};

const getUserByUsername = async (username) => {
    const user = await Users.find({username: { '$regex': username, $options: 'i' }});
    if (user.length == 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const updateUserByUsername = async (user, username, userBody) => {
    console.log(user)
    let userToUpdate = await getUserByUsername(username);
    console.log(userToUpdate)
    if (user.username !== userToUpdate[0].username) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorized"
        );
    }
    userToUpdate = await Users.findOneAndUpdate({username: { '$regex': username, $options: 'i' }}, userBody, {returnDocument: 'after'});

    return userToUpdate;
};

module.exports = {
    register,
    login,
    createUser,
    getAllUsers,
    getUserByUsername,
    updateUserByUsername,
    
};
