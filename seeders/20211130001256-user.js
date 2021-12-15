const bcrypt = require('bcrypt')
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const hashPassword = await bcrypt.hash('1234567890', 10)
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: 'admin@gmail.com',
          password: hashPassword,
          fullName: 'admin',
          phone: '',
          address: '',
          gender: '',
          status: 'admin',
          image: ''
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
