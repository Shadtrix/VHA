module.exports = (sequelize, DataTypes) => {
  const EmailCategory = sequelize.define("EmailCategory", {
    email_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "emails",
        key: "id"
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id"
      }
    }
  }, {
    tableName: "email_categories",
    timestamps: false
  });

  return EmailCategory;
};
