import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "stateStorage", modelName: "stateStorage" })
export class StateStorageItem {
    @PrimaryKey
    @Column
    handle: string;
    @Column
    name: string;
    @Column
    storage: string;
    @Column
    channelName: string;

    constructor(handle: string, name: string, channelName: string) {
        this.handle = handle;
        this.name = name;
        this.channelName = channelName;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('stateStorage', {
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            storage: {
                type: DataTypes.STRING(8000),
                allowNull: true
            },
            channelName: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            }
        }, { freezeTableName: true });
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.models.stateStorage.belongsTo(sequelize.models.twitch, { as: 'twitch', foreignKey: 'channelName' });
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: StateStorageItem }): Promise<number> {
        try {
            const item = await sequelize.models.stateStorage.findOne({ where: { handle: element.handle, channelName: element.channelName } });
            if (item) {
                await sequelize.models.stateStorage.update(element, ({ where: { handle: element.handle, channelName: element.channelName } }));
                return 201;
            } else {
                await sequelize.models.stateStorage.create(element as any);
                return 201;
            }
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}