const UserModel = require("../models/user-model");
const { v4 } = require('uuid');
const bcrypt = require("bcrypt");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`User already registered with email: ${email}`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = v4()
        const user = await UserModel.create({email: email, password: hashPassword, activationLink: activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest(`Wrong activation link: ${activationLink}`);
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        try {
            console.log('[LOGIN] email:', email);
            const user = await UserModel.findOne({email})
            if (!user) {
                console.log('[LOGIN] Пользователь не найден:', email);
                throw ApiError.BadRequest(`Пользователь с таким email ${email} не был найден`);
            }
            const isPassEquals = await bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                throw ApiError.BadRequest(`Неверный пароль`);
            }
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto}
        } catch (err) {
            throw err;
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnathorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnathorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find({});
        const usersDto = users.map(user => new UserDto(user));
        console.log(usersDto);
        return usersDto;
    }
}

module.exports = new UserService();