import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const options = {
    apis: [
        `${dirname}/routes/api.js`,
        `${dirname}/routes/api/api.adventure.js`,
        `${dirname}/routes/api/api.command.js`,
        `${dirname}/routes/api/api.daily.js`,
        `${dirname}/routes/api/api.enemy.js`,
        `${dirname}/routes/api/api.healingPotion.js`,
        `${dirname}/routes/api/api.help.js`,
        `${dirname}/routes/api/api.hero.js`,
        `${dirname}/routes/api/api.heroInventory.js`,
        `${dirname}/routes/api/api.heroPromotion.js`,
        `${dirname}/routes/api/api.heroTrait.js`,
        `${dirname}/routes/api/api.heroWallet.js`,
        `${dirname}/routes/api/api.historyDuell.js`,
        `${dirname}/routes/api/api.historySteal.js`,
        `${dirname}/routes/api/api.historyAdventure.js`,
        `${dirname}/routes/api/api.item.js`,
        `${dirname}/routes/api/api.itemCategory.js`,
        `${dirname}/routes/api/api.level.js`,
        `${dirname}/routes/api/api.location.js`,
        `${dirname}/routes/api/api.loot.js`,
        `${dirname}/routes/api/api.menu.js`,
        `${dirname}/routes/api/api.migration.js`,
        `${dirname}/routes/api/api.node.js`,
        `${dirname}/routes/api/api.placeholder.js`,
        `${dirname}/routes/api/api.promotion.js`,
        `${dirname}/routes/api/api.raid.js`,
        `${dirname}/routes/api/api.raidBoss.js`,
        `${dirname}/routes/api/api.raidHero.js`,
        `${dirname}/routes/api/api.say.js`,
        `${dirname}/routes/api/api.stateStorage.js`,
        `${dirname}/routes/api/api.trainer.js`,
        `${dirname}/routes/api/api.translation.js`,
        `${dirname}/routes/api/api.twitch.js`,
        `${dirname}/routes/api/api.validation.js`,
        `${dirname}/routes/api/api.version.js`,
    ],
    swaggerDefinition: {
        basePath: '/api',
        info: {
            description: 'Vollständige API Entwicklerdokumentation.',
            swagger: '2.0',
            title: 'Social Adventure',
            version: '1.3.26',
        }
    }
};
const specs = swaggerJsdoc(options);
export default specs;
//# sourceMappingURL=swagger.js.map