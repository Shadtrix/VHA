module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
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
      type: DataTypes.STRING,
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
        model: 'categories', // <-- Use table name as string, not imported model
        key: 'id'
      }
    }
  });

  return Email;
};
