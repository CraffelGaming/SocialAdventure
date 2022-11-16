import { DataTypes } from 'sequelize';
module.exports = {
    up: async (queryInterface, sequelize) => {
        return Promise.all([
            queryInterface.addColumn('hero', 'lastLeave', {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            })
        ]);
    },
    down: async (queryInterface, sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('hero', 'lastLeave')
        ]);
    }
};
//# sourceMappingURL=update_002.js.map