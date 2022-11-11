const User = require('./user.model');
// const Article = require('../articles/article.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('./user.service')
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// const register = async (req, res) => {
// 	try {
// 		const user = await User.create({ ...req.body });
// 		const token = user.createJWT();

// 		res.status(201).json({
// 			status: 'success',
// 			data: {
// 				user,
// 				token,
// 			},
// 		});
// 	} catch (error) {
// 		console.log({ error });
// 	}
// };

const register = catchAsync(async (req, res) => {
    const user = await userService.register(req.body);
    res.status(httpStatus.CREATED).send(user);
  });

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			status: 'fail',
			message: 'Please provide email and password',
		});
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return res.status(401).json({
			status: 'fail',
			message: 'Incorrect email or password',
		});
	}

	const token = user.createJWT();

	res.status(200).json({
		status: 'success',
		data: {
			user,
			token,
		},
	});
};

module.exports = {
	register,
	login,
};
