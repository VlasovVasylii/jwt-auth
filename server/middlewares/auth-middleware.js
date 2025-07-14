const ApiErrorr = require("../exceptions/api-error");
const tokenService = require("../services/token-service");

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return next(ApiErrorr.UnathorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiErrorr.UnathorizedError());
        }

        const userData = tokenService.validateToken(accessToken);
        if (!userData) {
            return next(ApiErrorr.UnathorizedError());
        }
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiErrorr.UnathorizedError());
    }
}