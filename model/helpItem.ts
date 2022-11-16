import { Column, Table, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "help", modelName: "help"})
export class HelpItem {
    @PrimaryKey
    @Column
    handle: number;
    @Column
    node: string;
    @Column
    name: string;
    @Column
    mail: string;
    @Column
    content: string;

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('help', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            node: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING(1000),
                allowNull: false
            },
          }, {freezeTableName: true});
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HelpItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.help.findByPk(element.handle);
                if(item){
                    await sequelize.models.help.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.node != null && element.node.length > 0 &&element.name != null && element.name.length > 0 && element.mail != null && element.mail.length > 0 && element.content != null && element.content.length > 0){
                    await sequelize.models.help.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}