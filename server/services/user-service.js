const UserModel = require("../models/user-model");
const { v4 } = require('uuid');
const bcrypt = require("bcrypt");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require('../exceptions/api-error');

/**
 * Сервис пользователей. Содержит бизнес-логику для работы с пользователями.
 */
class UserService {
    /**
     * Регистрация пользователя
     * @param email {string}
     * @param password {string}
     * @returns {Promise<any>}
     */
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

    /**
     * Активация пользователя
     * @param activationLink {string}
     * @returns {Promise<void>}
     */
    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest(`Wrong activation link: ${activationLink}`);
        }
        user.isActivated = true;
        await user.save();
    }

    /**
     * Логин пользователя
     * @param email {string}
     * @param password {string}
     * @returns {Promise<any>}
     */
    async login(email, password) {
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
    }

    /**
     * Выход пользователя
     * @param refreshToken {string}
     * @returns {Promise<any>}
     */
    async logout(refreshToken) {
        return tokenService.removeToken(refreshToken);
    }

    /**
     * Обновление токена
     * @param refreshToken {string}
     * @returns {Promise<any>}
     */
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

    /**
     * Получить всех пользователей
     * @returns {Promise<any[]>}
     */
    async getAllUsers() {
        const users = await UserModel.find({});
        const usersDto = users.map(user => new UserDto(user));
        console.log(usersDto);
        return usersDto;
    }

    /**
     * Запрос на сброс пароля
     * @param email {string}
     * @returns {Promise<void>}
     */
    async forgotPassword(email) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            // Не раскрываем, что пользователя нет
            return;
        }
        const resetToken = v4();
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 час
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = expires;
        await user.save();
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await mailService.sendResetPasswordMail(user.email, resetLink);
    }

    /**
     * Сброс пароля по токену
     * @param token {string}
     * @param newPassword {string}
     * @returns {Promise<void>}
     */
    async resetPassword(token, newPassword) {
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            throw ApiError.BadRequest('Ссылка для сброса пароля недействительна или устарела');
        }
        user.password = await bcrypt.hash(newPassword, 3);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    }
}

module.exports = new UserService();