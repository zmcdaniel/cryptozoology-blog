'use strict';
module.exports = function(sequelize, DataTypes) {
  var article = sequelize.define('article', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    authorName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.article.belongsToMany(models.tag, {through: models.article_tag});
      }
    }
  });
  return article;
};