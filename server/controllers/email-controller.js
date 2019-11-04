module.exports = function(sequelize, DataTypes) {
    var product = sequelize.define("product", {
      // Giving the Product model a name of type STRING
      name: DataTypes.STRING,
      description: DataTypes.STRING
    });
  
    product.associate = function(models) {
      // Associating Product with Posts
      // When an Product is deleted, also delete any associated Posts
      product.belongsToMany(models.store, {
        through: models.inventory
      });
      product.belongsTo(models.user, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return product;
  };
  