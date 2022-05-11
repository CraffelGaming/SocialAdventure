import { Column, Table, Model, Sequelize } from 'sequelize-typescript';
@Table({
    tableName: 'version'
  })
export class VersionItem extends Model {
    @Column
    version: string;

    constructor(version : string){
        super();
        this.version = version;
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        const item = new VersionItem(require('./../package.json').version);
        if(await sequelize.models.VersionItem.count({ where: { version: item.version } }) === 0)
            item.save();
    }
}

module.exports.default = VersionItem;