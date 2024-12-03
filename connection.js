const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_LOGIN,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'postgres',
        pool: {
            max: 10, //максимальное кол-во соединений в пуле
            min: 0, //минимальное кол-во соединений в пуле
            acquire: 30000, //время в миллисекундах, в течение которого будет осуществляться попытка установить соединение, прежде чем будет сгенерировано исключение
            idle: 10000, //время простоя в миллисекундах, по истечении которого соединение покинет пул (Default: 1000)
        },

    }
);

sequelize
    .authenticate()
    .then(() => console.log('Connected.'))
    .catch((err) =>
        console.error('Connection error: ', err)
    );

module.exports = sequelize;