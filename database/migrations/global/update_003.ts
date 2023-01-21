import { DataTypes, QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export async function up (queryInterface : QueryInterface, sequelize : Sequelize) {
  return Promise.all([
    queryInterface.sequelize.query("UPDATE node SET isActive = 0 WHERE name IN ('crikvenica', 'caniballflower', 'hastenichjesacht', 'coren_dragon', 'coren_dragon', 'gamingjesus1995', 'renekoetteritzsch')")
  ]);
}

export async function down (queryInterface : QueryInterface, sequelize : Sequelize) {
  return Promise.all([
    queryInterface.sequelize.query("UPDATE node SET isActive = 1 WHERE name IN ('crikvenica', 'caniballflower', 'hastenichjesacht', 'coren_dragon', 'coren_dragon', 'gamingjesus1995', 'renekoetteritzsch')")
  ]);
}