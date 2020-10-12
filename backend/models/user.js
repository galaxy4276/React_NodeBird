module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // db in users table
    // id가 기본적으로 들어간다.
    email: { // Column // 실제 데이터는 Row
      type: DataTypes.STRING(30),
      allowNull: false, // required
      unique: true // 고유한 값 ( 중복 X )
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false, // required
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false, // required
    },
  }, {
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  };

  return User;
} 