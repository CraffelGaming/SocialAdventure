import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./enemyItem.json');
import { ValidationItem } from './validationItem';

@Table({ tableName: "enemy", modelName: "enemy"})
export class EnemyItem extends Model<EnemyItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    name: string;
    @Column
    description: string;
    @Column
    difficulty: number = 1;
    @Column
    hitpoints: number = 10;
    @Column
    strength: number = 5;
    @Column
    isActive: boolean = true;
    @Column
    experienceMin: number = 100;
    @Column
    experienceMax: number = 200;
    @Column
    goldMin: number = 100;
    @Column
    goldMax: number = 200;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('enemy', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            difficulty: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            hitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            strength: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            experienceMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            experienceMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 200
            },
            goldMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            goldMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 200
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as EnemyItem[];

            for(const item of items){
                if(await sequelize.models.enemy.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.enemy.create(item as any);
                } else await sequelize.models.enemy.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, globalSequelize, element }: { sequelize: Sequelize, globalSequelize:Sequelize,  element: EnemyItem }): Promise<number>{
        try{
            const item = await sequelize.models.enemy.findByPk(element.handle);
            if(await EnemyItem.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })){
                if(item){
                    await sequelize.models.enemy.update(element, {where: {handle: element.handle}});
                    return 201;
                }
                else {
                    await sequelize.models.enemy.create(element as any);
                    return 201;
                }
            } else return 406;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async validate({ sequelize, globalSequelize, element, isUpdate }: { sequelize: Sequelize, globalSequelize: Sequelize, element: EnemyItem, isUpdate: boolean }) : Promise<boolean>{
        let isValid = true;

        const validations = await globalSequelize.models.validation.findAll({where: { page: 'enemy'}}) as Model<ValidationItem>[];

        if(!(!element.experienceMin       || element.experienceMin        && element.experienceMin >= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('min')   && element.experienceMin <= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('max')))   isValid = false;
        if(!(!element.experienceMax       || element.experienceMax        && element.experienceMax >= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('min')   && element.experienceMax <= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('max')))   isValid = false;
        if(!(!element.goldMin             || element.goldMin              && element.goldMin >= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('min')               && element.goldMin <= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('max')))               isValid = false;
        if(!(!element.goldMax             || element.goldMax              && element.goldMax >= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('min')               && element.goldMax <= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('max')))               isValid = false;
        if(!(!element.strength            || element.strength             && element.strength >= validations.find(x => x.getDataValue('handle') === 'strength').getDataValue('min')             && element.strength <= validations.find(x => x.getDataValue('handle') === 'strength').getDataValue('max')))             isValid = false;
        if(!(!element.hitpoints           || element.hitpoints            && element.hitpoints >= validations.find(x => x.getDataValue('handle') === 'hitpoints').getDataValue('min')           && element.hitpoints <= validations.find(x => x.getDataValue('handle') === 'hitpoints').getDataValue('max')))           isValid = false;

        if(!isUpdate){
            if(!(element.name != null && element.name.length > 0)){
                isValid = false;
            }
        }
        return isValid;
    }
}
module.exports.default = EnemyItem;

