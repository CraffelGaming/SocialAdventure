
import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { AdventureItem } from './adventureItem.js';
import { HeroItem } from './heroItem.js';
import { HeroWalletItem } from './heroWalletItem.js';
import { ItemItem } from './itemItem.js';

@Table({ tableName: "heroInventory", modelName: "heroInventory"})
export class HeroInventoryItem extends Model<HeroInventoryItem>{
    @PrimaryKey
    @Column
    itemHandle: number;
    @PrimaryKey
    @Column
    heroName: string;
    @Column
    quantity: number = 0;
    @Column
    isReload: boolean = false;
    
    hero: HeroItem;
    item: ItemItem;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('heroInventory', {
            itemHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.heroInventory.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
        sequelize.models.heroInventory.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle'});
    }

    static async transferAdventureToInventory({ sequelize, adventure }: { sequelize: Sequelize; adventure: Model<AdventureItem> }){
        const inventory = await sequelize.models.heroInventory.findOne({where: {itemHandle: adventure.getDataValue("itemHandle"), heroName:  adventure.getDataValue("heroName")}}) as Model<HeroInventoryItem>;

        if(inventory){
            await sequelize.models.heroInventory.increment('quantity', { by: 1, where: {itemHandle: adventure.getDataValue("itemHandle"), heroName:  adventure.getDataValue("heroName")}});
        } else {
            await sequelize.models.heroInventory.create({ heroName: adventure.getDataValue("heroName"),
                                                          itemHandle: adventure.getDataValue("itemHandle")});
        }
        adventure.destroy();
    }

    static async transferItemToInventory({ sequelize, item, heroName }: { sequelize: Sequelize; item: Model<ItemItem>, heroName: string }){
        const inventory = await sequelize.models.heroInventory.findOne({where: {itemHandle: item.getDataValue("handle"), heroName}}) as Model<HeroInventoryItem>;

        if(inventory){
            await sequelize.models.heroInventory.increment('quantity', { by: 1, where: {itemHandle: item.getDataValue("handle"), heroName}});
        } else {
            await sequelize.models.heroInventory.create({ heroName,
                                                          itemHandle: item.getDataValue("handle")});
        }
    }

    static async sell({ sequelize, itemHandle, heroName, quantity }: { sequelize: Sequelize, itemHandle: string, heroName: string, quantity: number }): Promise<number>{
        try{
            const inventory = await sequelize.models.heroInventory.findOne({ where: { heroName,  itemHandle} }) as Model<HeroInventoryItem>;
            const hero = await sequelize.models.hero.findByPk(heroName) as Model<HeroItem>;
            const item = await sequelize.models.item.findByPk(itemHandle) as Model<ItemItem>;
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName) as Model<HeroWalletItem>;

            if(inventory && hero && heroWallet && item && quantity > 0){
                if(quantity > inventory.getDataValue('quantity')){
                    quantity = inventory.getDataValue('quantity');
                }

                await heroWallet.increment('gold', { by: quantity * item.getDataValue("gold")});

                if(quantity >= inventory.getDataValue('quantity')){
                    inventory.destroy();
                } else {
                    await inventory.decrement('quantity', { by: quantity });
                }

                return 200;
            } else return 404;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
