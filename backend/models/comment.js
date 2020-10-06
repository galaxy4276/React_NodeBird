export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', { // db in Comments table
    // id가 기본적으로 들어간다.
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // emoji 쓰려면 mb4 
    collate: 'utf8_general_ci',
  });

  Comment.associate = (db) => {};

  return Comment
}