import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "raid", modelName: "raid"})
export class RaidItem extends Model<RaidItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    raidBossHandle: number;
    @Column
    hitpoints: number = 1000;
    @Column
    isDefeated: boolean = false;
    @Column
    isActive: boolean = false;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('raid', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            raidBossHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isDefeated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize }){
        sequelize.models.raid.belongsTo(sequelize.models.raidBoss, { as: 'raidBoss', foreignKey: 'raidBossHandle'});
        sequelize.models.raid.hasMany(sequelize.models.raidHero, { as: 'raidHeroes', foreignKey: 'raidHandle'});
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: RaidItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.raid.findByPk(element.handle);
                if(item){
                    await sequelize.models.raid.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.raidBossHandle != null && element.raidBossHandle > 0){
                    await sequelize.models.raid.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}