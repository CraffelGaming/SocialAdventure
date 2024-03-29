import { DataTypes } from 'sequelize';
export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.addColumn('node', 'endpoint', {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '/'
        })
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.removeColumn('node', 'endpoint')
    ]);
}
//# sourceMappingURL=update_001.js.map