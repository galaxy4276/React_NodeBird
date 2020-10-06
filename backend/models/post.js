export default (sequelize, DataTypes) => {
  const Post = sequelize.define('post', { // db in Posts table
    // id가 기본적으로 들어간다.
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // emoji 쓰려면 mb4 
    collate: 'utf8_general_ci',
  });

  Post.associate = (db) => {};

  return Post
}