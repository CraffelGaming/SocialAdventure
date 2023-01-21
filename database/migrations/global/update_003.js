export async function up(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.sequelize.query("UPDATE node SET isActive = 0 WHERE name IN ('crikvenica', 'caniballflower', 'hastenichjesacht', 'coren_dragon', 'coren_dragon', 'gamingjesus1995', 'renekoetteritzsch')")
    ]);
}
export async function down(queryInterface, sequelize) {
    return Promise.all([
        queryInterface.sequelize.query("UPDATE node SET isActive = 1 WHERE name IN ('crikvenica', 'caniballflower', 'hastenichjesacht', 'coren_dragon', 'coren_dragon', 'gamingjesus1995', 'renekoetteritzsch')")
    ]);
}
//# sourceMappingURL=update_003.js.map