module.exports = (sequelize, DataTypes) => {
  const ModerationLog = sequelize.define("ModerationReview", {
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  return ModerationLog;
};
