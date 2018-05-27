/*jshint esversion: 6*/

module.exports = function(sequelize, DataTypes) {
    var Location = sequelize.define("Location", {
  
      locationName : {
        type : DataTypes.STRING,
        allowNull: false
      }
    });

    return Location;
  };