import { DataTypes } from 'sequelize';
module.exports = {
    up: async (queryInterface, sequelize) => {
        return Promise.all([
            queryInterface.addColumn('command', 'isModerator', {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            })
        ]);
    },
    down: async (queryInterface, sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('command', 'isModerator')
        ]);
    }
};
//# sourceMappingURL=update_001.js.map