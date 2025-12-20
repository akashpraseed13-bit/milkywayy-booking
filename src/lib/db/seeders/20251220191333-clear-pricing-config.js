'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dynamic_configs', {key: 'pricing'}, {})
  },

  async down (queryInterface, Sequelize) {
  }
};
