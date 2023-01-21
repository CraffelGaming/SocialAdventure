export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.sequelize.query("UPDATE trainer SET value = 'Rüstungsexperte' WHERE Handle = 'defence'")
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.sequelize.query("UPDATE trainer SET value = 'Adlerauge' WHERE Handle = 'defence'")
    ]);
}
//# sourceMappingURL=update_005.js.map