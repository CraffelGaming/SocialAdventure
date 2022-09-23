import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./enemyItem.json');

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
    GoldMin: number = 100;
    @Column
    GoldMax: number = 200;

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
            GoldMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            GoldMax: {
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

    static async put({ sequelize, element }: { sequelize: Sequelize, element: EnemyItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.enemy.findByPk(element.handle);
                if(item){
                    await sequelize.models.enemy.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.name != null && element.name.length > 0){
                    await sequelize.models.enemy.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = EnemyItem;

