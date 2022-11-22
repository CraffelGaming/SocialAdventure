import { DataTypes } from 'sequelize';
export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.addColumn('hero', 'lastLeave', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.UTC(2020, 1, 1)
        })
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.removeColumn('hero', 'lastLeave')
    ]);
}
//# sourceMappingURL=update_002.js.map