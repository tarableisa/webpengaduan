import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Admin = db.define("admin", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

export default Admin;
