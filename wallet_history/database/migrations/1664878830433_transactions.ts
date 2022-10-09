import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.increments('id').primary()
      table.integer('wallet_id')
      .unsigned()
      .notNullable()
      .references('wallets.id')
      .onDelete('CASCADE');

      table.integer('amount').unsigned().notNullable();

      table.string('type').notNullable().checkIn(['expense', 'income']);
      table.string('category').notNullable().checkIn(['expense', 'salary', 'loan']);
     
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
