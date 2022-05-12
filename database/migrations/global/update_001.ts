import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

module.exports = {
  up: async (queryInterface : QueryInterface, sequelize : Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'node',
        'endpoint',
        {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '/'
        },
      )
    ]);
  },

  down: async (queryInterface : QueryInterface, sequelize : Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('node', 'endpoint')
    ]);
  }
};