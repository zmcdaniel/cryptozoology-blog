'use strict';
module.exports = function(sequelize, DataTypes) {
  var article_tag = sequelize.define('article_tag', {
    articleId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return article_tag;
};