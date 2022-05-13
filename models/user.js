const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

//create our user model
class User extends Model {
    //Set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table columns and configuration
User.init(
  {
    //define an id column
    id: {
      // use the special Sequelize DataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      //this is the equivalent of SQL's 'NOT NULL' option
      allowNull: false,
      // instruct that this is the Primary Key
      primaryKey: true,
      // turn on auto increment
      autoIncrement: true,
    },
    //define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //define an email coumn
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // there cannot be any duplicate email values in this table
      unique: true,
      // if allowNull is set to false, we can run out data through validators before creating the table data
      validate: {
        isEmail: true,
      },
    },
    // define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //this means the password must be at least four characters long
        len: [4],
      },
    },
  },
  {
    hooks: {
        //Set up beforeCreate lifecycle "hook" funcitonality
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
    },

    //Table config options go here (https://sequelize.org/v5/manual/models-definition.html#configuration)

    //pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    //dont automatically create createedAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    //user underscores instead of camel-casing (i.e. 'comment_text' and not 'commentText)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: "user",
  }
);

module.exports = User;
