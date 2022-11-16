import { DataTypes } from 'sequelize';
module.exports = {
    up: async (queryInterface, sequelize) => {
        return Promise.all([
            queryInterface.addColumn('node', 'endpoint', {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '/'
            })
        ]);
    },
    down: async (queryInterface, sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('node', 'endpoint')
        ]);
    }
};
//# sourceMappingURL=update_001.js.map