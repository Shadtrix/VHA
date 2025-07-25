const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Category = sequelize.define("Category", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { 
      type: DataTypes.STRING, allowNull: false, unique: true }}, 
      {
        tableName: "categories",
        timestamps: false,
      });

  Category.associate = (models) => {
    Category.hasMany(models.Email, { foreignKey: "category_id" });
    Category.belongsToMany(models.Email, {
      through: "email_categories",
      foreignKey: "category_id",
      otherKey: "email_id",
      as: "matched_emails"
    });
  };

  return Category;
};