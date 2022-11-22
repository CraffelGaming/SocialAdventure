import { DataTypes } from 'sequelize';
export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.addColumn('command', 'isModerator', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        })
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.removeColumn('command', 'isModerator')
    ]);
}
//# sourceMappingURL=update_001.js.map