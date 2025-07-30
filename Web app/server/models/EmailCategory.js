module.exports = (sequelize, DataTypes) => {
  const EmailCategory = sequelize.define("EmailCategory", {
    email_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "emails",
        key: "id"
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "categories",
        key: "id"
      }
    }
  }, {
    tableName: "email_categories",
    timestamps: false
  });

  EmailCategory.associate = (models) => {
    EmailCategory.belongsTo(models.Email, { foreignKey: "email_id" });
    EmailCategory.belongsTo(models.Category, { foreignKey: "category_id" });
  };

  return EmailCategory;
};
