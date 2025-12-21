import { DataTypes } from "sequelize";
import { OUR_WORK_TYPES } from "../../config/app.config.js";
import { sequelize } from "../db.js";

const OurWork = sequelize.define(
  "OurWork",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(OUR_WORK_TYPES),
      allowNull: false,
    },
    mediaContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "media_content",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_visible",
    },
  },
  {
    tableName: "our_works",
    timestamps: true,
    underscored: true,
  },
);

export default OurWork;
