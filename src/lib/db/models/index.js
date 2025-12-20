import { sequelize } from "../db.js";
import Booking from "./booking.js";
import Coupon from "./coupon.js";
import DynamicConfig from "./dynamicconfig.js";
import Transaction from "./transaction.js";
import User from "./user.js";
import WalletTransaction from "./wallettransaction.js";

const models = {
  User,
  Booking,
  Transaction,
  Coupon,
  WalletTransaction,
  DynamicConfig,
};

export {
  User,
  Booking,
  Transaction,
  Coupon,
  WalletTransaction,
  DynamicConfig,
  sequelize,
};

export default models;
