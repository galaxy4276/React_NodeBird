module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', { // db in Comments table
    // id가 기본적으로 들어간다.
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // UserId: {},
    // PostId: {},
  }, {
  });

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };

  return Comment;
}