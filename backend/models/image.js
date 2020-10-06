module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', { // db in Images table
    // id가 기본적으로 들어간다.
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  }, {
  });

  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };

  return Image;
}