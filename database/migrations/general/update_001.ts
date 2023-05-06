import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export async function up(queryInterface: QueryInterface, sequelize: Sequelize) {
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
}

export async function down(queryInterface: QueryInterface, sequelize: Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('command', 'isModerator')
  ]);
}