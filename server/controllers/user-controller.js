const UserService = require("../services/user-service");
const {validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");


/**
 * Контроллер пользователя. Обрабатывает запросы, связанные с пользователями.
 */
class UserController {
    /**
     * Регистрация пользователя
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async registration(req, res, next){
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
            }
            const {email, password} = req.body;
            // Проверка сложности пароля
            if (!isPasswordStrong(password)) {
                return next(ApiError.BadRequest("Пароль слишком простой. Требования: минимум 8 символов, хотя бы одна заглавная буква, одна строчная, одна цифра и один спецсимвол."));
            }
            const userData = await UserService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Логин пользователя
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async login(req, res, next){
        try {
            console.log('[CONTROLLER][LOGIN] req.body:', req.body);
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            console.log('[CONTROLLER][LOGIN] Успешно, userData:', userData);
            return res.json(userData);
        } catch (e) {
            console.log('[CONTROLLER][LOGIN] Ошибка:', e);
            next(e);
        }
    }

    /**
     * Выход пользователя
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token)
        } catch (e) {
            next(e);
        }
    }

    /**
     * Обновление токена
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Активация пользователя по ссылке
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async activate(req, res, next){
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Получить всех пользователей
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async getUsers(req, res, next){
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Запрос на сброс пароля
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            await UserService.forgotPassword(email);
            return res.json({ message: 'Письмо для сброса пароля отправлено на почту, если такой email зарегистрирован.' });
        } catch (e) {
            next(e);
        }
    }

    /**
     * Сброс пароля по токену
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            // Проверка сложности пароля
            if (!isPasswordStrong(password)) {
                return next(ApiError.BadRequest("Пароль слишком простой. Требования: минимум 8 символов, хотя бы одна заглавная буква, одна строчная, одна цифра и один спецсимвол."));
            }
            await UserService.resetPassword(token, password);
            return res.json({ message: 'Пароль успешно изменён' });
        } catch (e) {
            next(e);
        }
    }
}

// Функция проверки сложности пароля
function isPasswordStrong(password) {
    // Минимум 8 символов, хотя бы одна заглавная, одна строчная, одна цифра, один спецсимвол
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

module.exports = new UserController();