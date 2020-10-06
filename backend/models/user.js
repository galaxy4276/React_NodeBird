export default (sequelize, DataTypes) => {
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
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  User.associate = (db) => {};

  return User
}