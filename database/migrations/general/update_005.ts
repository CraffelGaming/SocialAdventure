import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export async function up(queryInterface: QueryInterface, sequelize: Sequelize) {
  return Promise.all([
    queryInterface.sequelize.query("UPDATE trainer SET value = 'Rüstungsexperte' WHERE Handle = 'defence'")
  ]);
}

export async function down(queryInterface: QueryInterface, sequelize: Sequelize) {
  return Promise.all([
    queryInterface.sequelize.query("UPDATE trainer SET value = 'Adlerauge' WHERE Handle = 'defence'")
  ]);
}