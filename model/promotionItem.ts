import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./promotionItem.json');
import { HeroItem } from './heroItem';
import { HeroWalletItem } from './heroWalletItem';
import { ItemItem } from './itemItem';
import { HeroInventoryItem } from './heroInventoryItem';
import { HeroPromotionItem } from './heroPromotionItem';

@Table({ tableName: "promotion", modelName: "promotion"})
export class PromotionItem extends Model<PromotionItem>{
    @PrimaryKey
    @Column
    handle: string;
    @Column
    gold: number = 0;
    @Column
    diamond: number = 0;
    @Column
    experience: number = 0;
    @Column
    item: number;
    @Column
    validFrom: Date = new Date(2020, 1, 1);
    @Column
    validTo: Date = new Date(2099, 12, 31);
    @Column
    isMaster: boolean = false;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('promotion', {
            handle: {
                type: DataTypes.STRING(),
                allowNull: false,
                primaryKey: true
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            diamond: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            item: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            isMaster: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            validFrom: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            validTo: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.promotion.hasMany(sequelize.models.heroPromotion, { as: 'promotion', foreignKey: 'promotionHandle'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as PromotionItem[];

            for(const item of items){
                if(await sequelize.models.promotion.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.promotion.create(item as any);
                } else await sequelize.models.promotion.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: PromotionItem }): Promise<number>{
        try{
            const item = await sequelize.models.promotion.findByPk(element.handle);
            if(await PromotionItem.validate({ sequelize: sequelize, element: element, isUpdate: item ? true : false })){
                if(item){
                    await sequelize.models.promotion.update(element, {where: {handle: element.handle}});
                    return 201;
                } else {
                    await sequelize.models.promotion.create(element as any);
                    return 201;
                }
            } else return 406;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async validate({ sequelize, element, isUpdate }: { sequelize: Sequelize, element: PromotionItem, isUpdate: boolean }) : Promise<boolean>{
        let isValid = true;

        if(!(!element.gold       || element.gold        && element.gold >= 0        && element.gold <= 5000))        isValid = false;
        if(!(!element.diamond    || element.diamond     && element.diamond >= 0     && element.diamond <= 100))      isValid = false;
        if(!(!element.experience || element.experience  && element.experience >= 0  && element.experience <= 50000)) isValid = false;
        if(!(!element.item       || element.item        && await sequelize.models.item.findByPk(element.item)))      isValid = false;

        return isValid;
    }

    static async redeem({ sequelize, promotion, heroName }: { sequelize: Sequelize, promotion: PromotionItem, heroName: string }): Promise<number>{
        try{
            const hero = await sequelize.models.hero.findByPk(heroName) as Model<HeroItem>;
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName) as Model<HeroWalletItem>;
            const item = await sequelize.models.item.findByPk(promotion.item) as Model<ItemItem>;
            const heroPromotion = await sequelize.models.heroPromotion.findOne({where: { promotionHandle: promotion.handle, heroName}}) as Model<HeroPromotionItem>;

            if(promotion.validFrom.getTime() <= Date.now() && promotion.validTo.getTime() >= Date.now()){
                if(!heroPromotion){
                    if(promotion.gold > 0){
                        await heroWallet.increment('gold', { by: promotion.gold});
                    }

                    if(promotion.diamond > 0){
                        await heroWallet.increment('diamond', { by: promotion.diamond});
                    }

                    if(promotion.experience > 0){
                        hero.setDataValue("experience", hero.getDataValue("experience") + promotion.experience);
                    }

                    if(promotion.item > 0){
                        if(item){
                            HeroInventoryItem.transferItemToInventory({sequelize, item, heroName });
                        }
                    }

                    if(promotion.handle === 'NewStart'){
                        hero.setDataValue("isFounder", true);
                    }
                    hero.save();
                    HeroItem.calculateHero({sequelize, element: hero.get()});

                    const element = new HeroPromotionItem();
                    element.heroName = heroName;
                    element.promotionHandle = promotion.handle;
                    HeroPromotionItem.put({sequelize, element});

                    return 200;
                }
                return 204;
            } else return 201;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = PromotionItem;

