import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { HeroItem } from './heroItem.js';
import { HeroTraitItem } from './heroTraitItem.js';
import { HeroWalletItem } from './heroWalletItem.js';
import { ValidationItem } from './validationItem.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'trainerItem.json')).toString());
@Table({ tableName: "trainer", modelName: "trainer"})
export class TrainerItem extends Model<TrainerItem>{
    @PrimaryKey
    @Column
    handle: string;
    @Column
    value: string = "";
    @Column
    description: string = "";
    @Column
    gold: number = 0;
    @Column
    image: string;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('trainer', {
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as TrainerItem[];

            for(const item of items){
                if(await sequelize.models.trainer.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.trainer.create(item as any);
                } else await sequelize.models.trainer.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: TrainerItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle.length > 0){
                const item = await sequelize.models.trainer.findByPk(element.handle);
                if(item){
                    await sequelize.models.trainer.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.value != null && element.value.length > 0 && element.gold != null && element.gold > 0){
                    await sequelize.models.trainer.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async training({ sequelize, globalSequelize, trainerHandle, heroName }: { sequelize: Sequelize, globalSequelize: Sequelize, trainerHandle: string, heroName: string }): Promise<number>{
        try{
            const trainer = await sequelize.models.trainer.findByPk(trainerHandle) as Model<TrainerItem>;
            const hero = await sequelize.models.hero.findByPk(heroName) as Model<HeroItem>;
            const heroTrait = await sequelize.models.heroTrait.findByPk(heroName) as Model<HeroTraitItem>;
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName) as Model<HeroWalletItem>;
            const validation = await globalSequelize.models.validation.findAll({ where: { page: 'hero' }}) as Model<ValidationItem>[];

            if(trainer && hero && heroWallet && heroTrait && validation){
                const trait = (trainer.getDataValue("handle") + "Multipler") as keyof HeroTraitItem;
                const value = heroTrait.getDataValue(trait) as number;
                const price =  value * trainer.getDataValue("gold");

                if(heroWallet.getDataValue("gold") >= price){
                    if(value < validation.find(x => x.getDataValue("handle") === trait).getDataValue("max")){
                        await heroWallet.decrement('gold', { by: price});
                        await heroTrait.increment(trait, { by: 1});

                        if(trainer.getDataValue("handle") === "hitpoint"){
                            await hero.increment('hitpointsMax', { by: 10});
                            await hero.increment('hitpoints', { by: 10});
                        }

                        if(trainer.getDataValue("handle") === "strength"){
                            await hero.increment('strength', { by: 1});
                        }
                        return 200;
                    } else return 401;
                } else return 402;
            } else return 404;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}