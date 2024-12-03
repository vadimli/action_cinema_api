const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("../service/mail-service");
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
    async registerUser(email, password) {
        const candidate = await UserModel.findOne({ raw:true, where: { email }});
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует.`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activatedLink = uuid.v4();

        const user = await UserModel.create({email, password: hashPassword, activatedLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activatedLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({id: userDto.id, email: userDto.email, isActivated: userDto.isActivated});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userDto};
    }

   async activate(activatedLink) {
        const user = await UserModel.findOne({ raw: false, where: { activatedLink }});
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }

        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ raw:true, where: { email }});
        if (!user) {
            throw ApiError.BadRequest(`Пользователь с таким email не найден`);
        }

        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            throw ApiError.BadRequest(`Введен неверный пароль`);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({id: userDto.id, email: userDto.email, isActivated: userDto.isActivated});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userDto};

    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }
}

module.exports = new UserService();