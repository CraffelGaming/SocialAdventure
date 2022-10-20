import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

module.exports = {
  up: async (queryInterface : QueryInterface, sequelize : Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'command',
        'isModerator',
        {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
      },
      )
    ]);
  },

  down: async (queryInterface : QueryInterface, sequelize : Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('command', 'isModerator')
    ]);
  }
};