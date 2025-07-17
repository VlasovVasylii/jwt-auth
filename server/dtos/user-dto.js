module.exports = class UserDto {
    email;
    id;
    isActivated;
    twoFactorEnabled;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.twoFactorEnabled = model.twoFactorEnabled;
    }
}