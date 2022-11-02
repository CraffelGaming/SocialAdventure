import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

module.exports = {
  up: async (queryInterface : QueryInterface, sequelize : Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'hero',
        'lastLeave',
        {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Date.UTC(2020, 1, 1)
      },
      )
    ]);
  },

  down: async (queryInterface : QueryInterface, sequelize : Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('hero', 'lastLeave')
    ]);
  }
};