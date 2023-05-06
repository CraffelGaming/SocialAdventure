import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "historySteal", modelName: "historySteal" })
export class HistoryStealItem {
    @PrimaryKey
    @Column
    handle: string;
    @Column
    sourceHeroName: string;
    @Column
    targetHeroName: string;
    @Column
    rollSource: number = 0;
    @Column
    rollSourceCount: number = 0;
    @Column
    rollTarget: number = 0;
    @Column
    rollTargetCount: number = 0;
    @Column
    isSuccess: boolean = true;
    @Column
    itemName: string;
    @Column
    date: Date = new Date(2020, 1, 1);

    constructor(sourceHeroName: string, targetHeroName: string) {
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.date = new Date();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('historySteal', {
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
            rollSource: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rollSourceCount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rollTarget: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rollTargetCount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            isSuccess: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
        }, { freezeTableName: true });
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HistoryStealItem }): Promise<number> {
        try {
            const item = await sequelize.models.historySteal.findByPk(element.handle);

            if (item) {
                await sequelize.models.historySteal.update(element, { where: { handle: element.handle } });
                return 201;
            } else {
                await sequelize.models.historySteal.create(element as any);
                return 201;
            }
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}