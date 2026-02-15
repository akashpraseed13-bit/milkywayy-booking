/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("bookings", "booking_code", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    // Backfill existing rows
    await queryInterface.sequelize.query(
      "UPDATE bookings SET booking_code = 'MWY-' || LPAD(id::text, 6, '0') WHERE booking_code IS NULL;",
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("bookings", "booking_code");
  },
};
