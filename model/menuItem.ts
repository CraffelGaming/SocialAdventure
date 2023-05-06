import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'menuItem.json')).toString());
@Table({ tableName: "menu", modelName: "menu" })
export class MenuItem extends Model<MenuItem>{
    @PrimaryKey
    @Column
    endpoint: string;
    @Column
    name: string;
    @Column
    order: number;
    @Column
    authenticationRequired: boolean = false;
    @Column
    nodeRequired: boolean = false;
    @Column
    isActive: boolean = true;

    constructor(endpoint?: string, name?: string, order?: number) {
        super();
        this.endpoint = endpoint;
        this.name = name;
        this.order = order;
        this.authenticationRequired = false;
        this.nodeRequired = false;
        this.isActive = true;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('menu', {
            endpoint: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            authenticationRequired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            nodeRequired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, { freezeTableName: true });
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.models.menu.hasMany(sequelize.models.menu, { as: 'childs', foreignKey: 'parentEndpoint' });
        sequelize.models.menu.belongsTo(sequelize.models.menu, { as: 'parent', foreignKey: 'parentEndpoint' });
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void> {
        try {
            const items = JSON.parse(JSON.stringify(json)) as MenuItem[];

            for (const item of items) {
                if (await sequelize.models.menu.count({ where: { endpoint: item.endpoint } }) === 0) {
                    await sequelize.models.menu.create(item as any);
                } else await sequelize.models.menu.update(item, { where: { endpoint: item.endpoint } });
            }
        } catch (ex) {
            global.worker.log.error(ex);
        }
    }
}