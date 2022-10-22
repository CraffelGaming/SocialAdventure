import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./dailyItem.json');
import seedrandom from 'seedrandom';
import { ValidationItem } from './validationItem';
import { HeroTraitItem } from './heroTraitItem';

@Table({ tableName: "daily", modelName: "daily"})
export class DailyItem extends Model<DailyItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    value: string;
    @Column
    description: string;
    @Column
    goldMin: number = 100;
    @Column
    goldMax: number = 500;
    @Column
    experienceMin: number = 100;
    @Column
    experienceMax: number = 500;

    gold: number = 0;
    experience: number = 0;
    date: Date  = new Date(2020, 1, 1);

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('daily', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            goldMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            goldMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            },
            experienceMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            experienceMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as DailyItem[];

            for(const item of items){
                if(await sequelize.models.daily.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.daily.create(item as any);
                } // else await sequelize.models.daily.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize,globalSequelize, element }: { sequelize: Sequelize,globalSequelize: Sequelize, element: DailyItem }): Promise<number>{
        try{
            const item = await sequelize.models.daily.findByPk(element.handle);
            if(await DailyItem.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })){
                if(item){
                    await sequelize.models.daily.update(element, {where: {handle: element.handle}});
                    return 201;
                }
                else {
                    await sequelize.models.daily.create(element as any);
                    return 201;
                }
            } else return 406;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async validate({ sequelize, globalSequelize, element, isUpdate }: { sequelize: Sequelize, globalSequelize: Sequelize, element: DailyItem, isUpdate: boolean }) : Promise<boolean>{
        let isValid = true;

        const validations = await globalSequelize.models.validation.findAll({where: { page: 'daily'}}) as Model<ValidationItem>[];

        if(!(!element.experienceMin       || element.experienceMin        && element.experienceMin >= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('min')   && element.experienceMin <= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('max')))   isValid = false;
        if(!(!element.experienceMax       || element.experienceMax        && element.experienceMax >= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('min')   && element.experienceMax <= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('max')))   isValid = false;
        if(!(!element.goldMin             || element.goldMin              && element.goldMin >= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('min')               && element.goldMin <= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('max')))               isValid = false;
        if(!(!element.goldMax             || element.goldMax              && element.goldMax >= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('min')               && element.goldMax <= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('max')))               isValid = false;

        if(!isUpdate){
            if(!(element.value != null && element.value.length > 0))                isValid = false;
            if(!(element.description != null && element.description.length > 0))    isValid = false;
            if(!(element.goldMin != null && element.goldMin > 0))                   isValid = false;
            if(!(element.goldMax != null && element.goldMax > 0))                   isValid = false;
        }

        return isValid;
    }

    static async getCurrentDaily({ sequelize, count, node }: { sequelize: Sequelize, count: number, node: string  }) : Promise<DailyItem[]>{
        const item = await sequelize.models.daily.findAll({order: [ [ 'handle', 'ASC' ]], raw: false }) as Model<DailyItem>[];
        const today = new Date();
        const found: DailyItem[] = [];
        const generatorDaily = seedrandom(today.toDateString() + node);
        const generatorReward = seedrandom(today.toDateString() + node);

        for(let i = 1; i <= count; i++){
            const rand = Math.floor(generatorDaily() * (item.length - 0) + 0);
            const element = item.splice(rand, 1)[0].get();
            element.gold = Math.floor(generatorReward() * (element.goldMax - element.goldMin + 1) + element.goldMin);
            element.experience = Math.floor(generatorReward() * (element.experienceMax - element.experienceMin + 1) + element.experienceMin);
            element.date = today;
            found.push(element);
        }
        return found;
    }

    static async getCurrentDailyByHero({ sequelize, count, heroName, node }: { sequelize: Sequelize, count: number, heroName: string, node: string }) : Promise<DailyItem[]>{
        const found: DailyItem[] = await DailyItem.getCurrentDaily({sequelize, count, node})
        const trait = await sequelize.models.heroTrait.findByPk(heroName) as Model<HeroTraitItem>;
        for(const item of found){
            item.gold = Math.round(item.gold * ((trait.getDataValue("workMultipler") / 10) + 1));
            item.experience = Math.round(item.experience * ((trait.getDataValue("workMultipler") / 10) + 1));
        }
        return found;
    }
}
module.exports.default = DailyItem;

