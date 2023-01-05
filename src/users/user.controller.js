const User = require("./user.model");
// const Article = require('../articles/article.model');
const userService = require("./user.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
    const user = await userService.register(req.body);
    res.status(httpStatus.CREATED).send(user);
});

const login = catchAsync(async (req, res) => {
    const user = await userService.login(req.body);
    res.send(user);
});

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.user, req.body);
    res.status(httpStatus.CREATED).send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
    const user = await userService.getAllUsers(req.user);
    res.send(user);
});

const getUserByUsername = catchAsync(async (req, res) => {
    const user = await userService.getUserByUsername(req.params.username);
    res.send(user);
});

const updateUserByUsername = catchAsync(async (req, res) => {
    const user = await userService.updateUserByUsername(req.user, req.params.username, req.body);
    res.send(user);
});

module.exports = {
    register,
    login,
    createUser,
    getAllUsers,
    getUserByUsername,
    updateUserByUsername,
};
