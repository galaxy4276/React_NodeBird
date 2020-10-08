module.exports =  (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', { // db in Posts table
    // id가 기본적으로 들어간다.
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
  });

  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Post.belongsTo(db.Post, { as: 'Retweet' });
  };

  return Post;
}