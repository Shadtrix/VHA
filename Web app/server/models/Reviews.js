module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
    }
  });

  return Review;
};
