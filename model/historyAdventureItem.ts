import { Column, Table, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "historyAdventure", modelName: "historyAdventure" })
export class HistoryAdventureItem {
    @PrimaryKey
    @Column
    handle: string;
    @Column
    heroName: string;
    @Column
    enemyName: string;
    @Column
    heroHitpointsStart: number = 0;
    @Column
    heroHitpointsEnd: number = 0;
    @Column
    enemyHitpointsStart: number = 0;
    @Column
    enemyHitpointsEnd: number = 0;
    @Column
    isSuccess: boolean = true;
    @Column
    heroDamage: number = 0;
    @Column
    enemyDamage: number = 0;
    @Column
    gold: number = 0;
    @Column
    experience: number = 0;
    @Column
    itemName: string;
    @Column
    date: Date = new Date(2020, 1, 1);

    constructor() {
        this.date = new Date();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('historyAdventure', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            enemyName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            heroHitpointsStart: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            heroHitpointsEnd: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            enemyHitpointsStart: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            enemyHitpointsEnd: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isSuccess: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            enemyDamage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            heroDamage: {
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
            itemName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
        }, { freezeTableName: true });
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HistoryAdventureItem }): Promise<number> {
        try {
            const item = await sequelize.models.historyAdventure.findByPk(element.handle);

            if (item) {
                await sequelize.models.historyAdventure.update(element, { where: { handle: element.handle } });
                return 201;
            } else {
                await sequelize.models.historyAdventure.create(element as any);
                return 201;
            }
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}