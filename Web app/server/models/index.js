'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};
require('dotenv').config();
// Create sequelize instance using config
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        timezone: '+08:00'
    }
);
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) &&
            (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize,
            Sequelize.DataTypes);
        db[model.name] = model;
    });
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
const Category = require('./Category')(sequelize, Sequelize.DataTypes);
const Email = require('./Email')(sequelize, Sequelize.DataTypes);
Category.hasMany(Email, { foreignKey: 'category_id' });
Email.belongsTo(Category, { foreignKey: 'category_id' });
module.exports = {sequelize, Category, Email};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;