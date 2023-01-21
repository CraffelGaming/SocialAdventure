import { DataTypes } from 'sequelize';
export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.addColumn('heroTrait', 'perceptionMultipler', {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 1
        })
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.removeColumn('heroTrait', 'perceptionMultipler')
    ]);
}
//# sourceMappingURL=update_006.js.map