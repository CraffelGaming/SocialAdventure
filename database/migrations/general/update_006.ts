import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export async function up(queryInterface: QueryInterface, sequelize: Sequelize) {
  return Promise.all([
    queryInterface.addColumn(
      'heroTrait',
      'perceptionMultipler',
      {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 1
      },
    )
  ]);
}

export async function down(queryInterface: QueryInterface, sequelize: Sequelize) {
  return Promise.all([
    queryInterface.removeColumn('heroTrait', 'perceptionMultipler')
  ]);
}