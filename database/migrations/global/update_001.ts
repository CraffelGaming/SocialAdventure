import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export async function up(queryInterface: QueryInterface, sequelize: Sequelize) {
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
}

export async function down(queryInterface: QueryInterface, sequelize: Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('node', 'endpoint')
  ]);
}