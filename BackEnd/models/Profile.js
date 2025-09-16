
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Profile = sequelize.define("Profile", {
  Names: { type: DataTypes.STRING(50), allowNull: false },
  DocumentType: { type: DataTypes.ENUM("CC", "CE", "PP"), allowNull: false },
  DocumentNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  BirthDate: { type: DataTypes.DATEONLY, allowNull: false },
  Email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  Password: { type: DataTypes.STRING(255), allowNull: false },
  Status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
  Role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  Photo: { type: DataTypes.STRING(255), allowNull: true },
});

export default Profile;