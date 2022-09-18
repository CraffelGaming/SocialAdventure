import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./trainerItem.json');

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
}
module.exports.default = TrainerItem;

