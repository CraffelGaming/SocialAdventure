import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "migration", modelName: "migration"})
export class MigrationItem extends Model<MigrationItem>{
    @PrimaryKey
    @Column
    name: string;
    @Column
    isInstalled: boolean = false;

    constructor(name? : string, isInstalled? : boolean){
        super();
        this.name = name;
        this.isInstalled = isInstalled;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('migration', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            isInstalled: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false
           }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize, migrations }: { sequelize: Sequelize; migrations: MigrationItem[] }): Promise<void>{
        try{
            for(const item of migrations){
                if(await sequelize.models.migration.count({where: {name: item.name}}) === 0){
                    await sequelize.models.migration.create(item as any);
                }
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}