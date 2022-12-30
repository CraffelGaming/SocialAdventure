import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "raidHero", modelName: "raidHero"})
export class RaidHeroItem{
    @PrimaryKey
    @Column
    raidHandle: number;
    @PrimaryKey
    @Column
    heroName: string;
    @Column
    damage: number = 0;
    @Column
    isRewarded: boolean = false;
    @Column
    isActive: boolean = false;

    constructor({ raidHandle, heroName}: { raidHandle: number, heroName: string}){
        this.raidHandle = raidHandle;
        this.heroName = heroName;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('raidHero', {
            raidHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            damage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isRewarded: {
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
        sequelize.models.raidHero.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
        sequelize.models.raidHero.belongsTo(sequelize.models.raid, { as: 'raids', foreignKey: 'raidHandle'});
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: RaidHeroItem }): Promise<number>{
        try{
            if(element.raidHandle != null && element.raidHandle > 0 && element.heroName != null && element.heroName.length > 0){
                const item = await sequelize.models.raidHero.findOne({ where: {raidHandle : element.raidHandle, heroName: element.heroName} });
                if(item){
                    await sequelize.models.raidHero.update(element, { where: {raidHandle : element.raidHandle, heroName: element.heroName} });
                    return 201;
                } else {
                    await sequelize.models.raidHero.create(element as any);
                    return 201;
                }
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}