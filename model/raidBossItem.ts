import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'raidBossItem.json')).toString());
@Table({ tableName: "raidBoss", modelName: "raidBoss"})
export class RaidBossItem extends Model<RaidBossItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    name: string;
    @Column
    description: string;
    @Column
    hitpoints: number = 1000;
    @Column
    strength: number = 10;
    @Column
    gold: number = 5000;
    @Column
    diamond: number = 25;
    @Column
    experience: number = 3000;
    @Column
    categoryHandle: number = 1;
    @Column
    isActive: boolean = false;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('raidBoss', {
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
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            strength: {
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
        sequelize.models.raidBoss.belongsTo(sequelize.models.itemCategory, { as: 'category', foreignKey: 'categoryHandle'});
        sequelize.models.raidBoss.hasMany(sequelize.models.raid, { as: 'raids', foreignKey: 'raidBossHandle'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize }): Promise<void>{
        const handle = 1;
        try{
            const items = JSON.parse(JSON.stringify(json)) as RaidBossItem[];

            for(const item of items){
                if(await sequelize.models.raidBoss.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.raidBoss.create(item as any);
                } // else await sequelize.models.raidBoss.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: RaidBossItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.raidBoss.findByPk(element.handle);
                if(item){
                    await sequelize.models.raidBoss.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.name != null && element.name.length > 0){
                    await sequelize.models.raidBoss.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}