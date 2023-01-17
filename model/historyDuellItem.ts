import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "historyDuell", modelName: "historyDuell"})
export class HistoryDuellItem {
    @PrimaryKey
    @Column
    handle: string;
    @Column
    sourceHeroName: string;
    @Column
    targetHeroName: string;
    @Column
    sourceHitpoints: number = 0;
    @Column
    targetHitpoints: number = 0;
    @Column
    gold: number = 0;
    @Column
    experience: number = 0;
    @Column
    date: Date = new Date(2020, 1, 1);

    constructor(sourceHeroName: string, targetHeroName: string){
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.date = new Date();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('historyDuell', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            sourceHeroName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            targetHeroName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sourceHitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            targetHitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.historyDuell.belongsTo(sequelize.models.hero, { as: 'heroSource', foreignKey: 'sourceHeroName'});
        sequelize.models.historyDuell.belongsTo(sequelize.models.hero, { as: 'heroTarget', foreignKey: 'targetHeroName'});
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HistoryDuellItem }): Promise<number>{
        try{
            const item = await sequelize.models.historyDuell.findByPk(element.handle);

            if(item){
                await sequelize.models.historyDuell.update(element, {where: {handle: element.handle}});
                return 201;
            } else {
                await sequelize.models.historyDuell.create(element as any);
                return 201;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}