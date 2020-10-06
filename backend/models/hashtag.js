module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define('Hashtag', { // db in Hashtags table
    // id가 기본적으로 들어간다.
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
  });

  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  };

  return Hashtag;
}