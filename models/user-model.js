const Sequelize = require('sequelize');
const {sequelize} = require('../connection').dialect;
const Token = require('../models/token-model');

class User extends Sequelize.Model {}

User.init(
    {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isActivated: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        activatedLink: {
            type: Sequelize.STRING,
        },
    },
    { sequelize: sequelize, modelName: 'User' }
)

User.hasOne(Token);

sequelize.sync();

module.exports = User;
