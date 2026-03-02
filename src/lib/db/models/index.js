import { sequelize } from "../db.js";
import Booking from "./booking.js";
import Coupon from "./coupon.js";
import DynamicConfig from "./dynamicconfig.js";
import OurWork from "./ourwork.js";
import Review from "./review.js";
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
  OurWork,
  Review,
};

export {
  User,
  Booking,
  Transaction,
  Coupon,
  WalletTransaction,
  DynamicConfig,
  OurWork,
  Review,
  sequelize,
};

export default models;
