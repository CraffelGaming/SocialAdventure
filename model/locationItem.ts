import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./locationItem.json');

@Table({ tableName: "location", modelName: "location"})
export class LocationItem extends Model<LocationItem>{
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
    categoryHandle: number = 1;
    @Column
    isActive: boolean = false;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('location', {
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
            categoryHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize }){
        sequelize.models.location.belongsTo(sequelize.models.itemCategory, { as: 'category', foreignKey: 'categoryHandle'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as LocationItem[];

            for(const item of items){
                if(await sequelize.models.location.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.location.create(item as any);
                } // else await sequelize.models.location.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: LocationItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.location.findByPk(element.handle);
                if(item){
                    await sequelize.models.location.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.name != null && element.name.length > 0){
                    await sequelize.models.location.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = LocationItem;

