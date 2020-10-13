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
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImage, post.getImages
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
  };// add, get, set, remove

  return Post;
}