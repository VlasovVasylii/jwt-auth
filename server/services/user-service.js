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
     * @param {string} email
     * @param {string} password
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
     * @param {string} activationLink
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
     * @param {string} email
     * @param {string} password
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
        // 2FA: если включена, отправляем письмо и не выдаём токены
        if (user.twoFactorEnabled) {
            const { v4 } = require('uuid');
            const token = v4();
            const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут
            user.login2FAToken = token;
            user.login2FAExpires = expires;
            await user.save();
            const confirmLink = `${process.env.CLIENT_URL}/confirm-login/${token}`;
            await mailService.send2FALoginMail(user.email, confirmLink);
            return { twoFactorRequired: true, message: 'На вашу почту отправлено письмо для подтверждения входа.' };
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    /**
     * Выход пользователя
     * @param {string} refreshToken
     * @returns {Promise<any>}
     */
    async logout(refreshToken) {
        return tokenService.removeToken(refreshToken);
    }

    /**
     * Обновление токена
     * @param {string} refreshToken
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
     * @param {string} email
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
     * @param {string} token
     * @param {string} newPassword
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

    /**
     * Смена пароля авторизованным пользователем
     * @param {string} userId
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<void>}
     */
    async changePassword(userId, oldPassword, newPassword) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }
        const isPassEquals = await bcrypt.compare(oldPassword, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Старый пароль неверен');
        }
        user.password = await bcrypt.hash(newPassword, 3);
        await user.save();
    }

    /**
     * Инициировать смену пароля для авторизованного пользователя (отправить письмо со ссылкой)
     * @param {string} userId
     * @returns {Promise<void>}
     */
    async initiateChangePassword(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
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
     * Включить/выключить двухфакторную аутентификацию
     * @param {string} userId
     * @param {boolean} enabled
     * @returns {Promise<void>}
     */
    async set2FA(userId, enabled) {
        const user = await UserModel.findById(userId);
        if (!user) throw ApiError.BadRequest('Пользователь не найден');
        user.twoFactorEnabled = enabled;
        await user.save();
    }

    /**
     * Подтверждение входа по токену (2FA)
     * @param {string} token
     * @returns {Promise<{tokens?: any, user?: any, message?: string}>}
     */
    async confirmLogin(token) {
        const user = await UserModel.findOne({ login2FAToken: token, login2FAExpires: { $gt: new Date() } });
        if (!user) {
            return { message: 'Ссылка для подтверждения входа недействительна или устарела' };
        }
        user.login2FAToken = undefined;
        user.login2FAExpires = undefined;
        await user.save();
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { tokens, user: userDto };
    }
}

module.exports = new UserService();