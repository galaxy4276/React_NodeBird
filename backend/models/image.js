export default (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', { // db in Images table
    // id가 기본적으로 들어간다.
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  Image.associate = (db) => {};

  return Image
}