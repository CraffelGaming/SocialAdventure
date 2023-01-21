import { DataTypes } from 'sequelize';
export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.addColumn('node', 'database', {
            type: DataTypes.STRING,
            allowNull: true,
        })
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.removeColumn('node', 'database')
    ]);
}
//# sourceMappingURL=update_002.js.map