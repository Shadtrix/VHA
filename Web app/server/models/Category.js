const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { tableName: 'categories', timestamps: false });
  return Category;
};