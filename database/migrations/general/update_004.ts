import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export async function up (queryInterface : QueryInterface, sequelize : Sequelize) {
  return Promise.all([
    queryInterface.addColumn(
      'hero',
      'lastDuell',
      {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.UTC(2020, 1, 1)
      }
    )
  ]);
}

export async function down (queryInterface : QueryInterface, sequelize : Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('hero', 'lastDuell')
  ]);
}