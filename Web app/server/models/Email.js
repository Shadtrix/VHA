module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gmailId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    translated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    summarised: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    autoResponse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    last_classified_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: "emails",
    timestamps: false
  });

  Email.associate = (models) => {
    Email.belongsTo(models.Category, { foreignKey: "category_id" });
    Email.belongsToMany(models.Category, {
      through: "email_categories",
      foreignKey: "email_id",
      otherKey: "category_id",
      as: "matched_categories"
    });
  };

  return Email;
};