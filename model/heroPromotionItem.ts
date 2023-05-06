import { Column, Table, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { PromotionItem } from './promotionItem';
import { HeroItem } from './heroItem';

@Table({ tableName: "heroPromotion", modelName: "heroPromotion" })
export class HeroPromotionItem {
    @PrimaryKey
    @Column
    promotionHandle: string;
    @PrimaryKey
    @Column
    heroName: string;

    promotion: PromotionItem;
    hero: HeroItem;

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('heroPromotion', {
            promotionHandle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
        }, { freezeTableName: true });
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.models.heroPromotion.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.heroPromotion.belongsTo(sequelize.models.promotion, { as: 'promotion', foreignKey: 'promotionHandle' });
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HeroPromotionItem }): Promise<number> {
        try {
            const item = await sequelize.models.heroPromotion.findOne({ where: { heroName: element.heroName, promotionHandle: element.promotionHandle } });
            if (!item) {
                await sequelize.models.heroPromotion.create(element as any);
                return 201;
            }
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}