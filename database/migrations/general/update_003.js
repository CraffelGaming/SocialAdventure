import { DataTypes } from 'sequelize';
export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.addColumn('say', 'shortcuts', {
            type: DataTypes.STRING,
            allowNull: true
        })
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.removeColumn('say', 'shortcuts')
    ]);
}
//# sourceMappingURL=update_003.js.map