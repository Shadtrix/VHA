module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Review;
};
