import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, afterSave, beforeDelete} from '@ioc:Adonis/Lucid/Orm'
import Wallet from 'App/Models/Wallet'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public walletId: number

  @column()
  public amount: number

  @column()
  public type: string

  @column()
  public category: string

  @column.dateTime({ autoCreate: true,
    serialize:(value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    }
  })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true,
    serialize:(value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    }
  })
  public updatedAt: DateTime

  @belongsTo(() => Wallet)
  public wallet: BelongsTo<typeof Wallet>

  @afterSave()
  public static async updateBalance (Transaction: Transaction) {
    await Transaction.load('wallet');
    if(Transaction.type == "expense")
      Transaction.wallet.balance -= Transaction.amount;
    else
      Transaction.wallet.balance += Transaction.amount;
    Transaction.wallet.save();
  }

  @beforeDelete()
  public static async updateBalanceBeforeDelete (Transaction: Transaction) {
    await Transaction.load('wallet');
    if(Transaction.type == "expense")
      Transaction.wallet.balance += Transaction.amount;
    else
      Transaction.wallet.balance -= Transaction.amount;
    Transaction.wallet.save();
  }
}
