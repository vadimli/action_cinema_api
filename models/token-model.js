const Sequelize = require('sequelize');
const {sequelize} = require('../connection').dialect;

class Token extends Sequelize.Model {}

Token.init(
    {
        refreshToken: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },
    { sequelize: sequelize, modelName: 'Token' }
)

sequelize.sync();

module.exports = Token;
