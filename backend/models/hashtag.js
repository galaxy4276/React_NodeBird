export default (sequelize, DataTypes) => {
  const Hashtag = sequelize.define('Hashtag', { // db in Hashtags table
    // id가 기본적으로 들어간다.
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // emoji 쓰려면 mb4 
    collate: 'utf8_general_ci',
  });

  Hashtag.associate = (db) => {};

  return Hashtag
}