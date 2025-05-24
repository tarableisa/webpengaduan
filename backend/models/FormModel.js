import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Form = db.define("form", {
  namaPelapor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  waktuKejadian: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  bukti: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
   userId: {
  type: DataTypes.INTEGER,
  allowNull: false
  }
}, {
  freezeTableName: true,
});

export default Form;
