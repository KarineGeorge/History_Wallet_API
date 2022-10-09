import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WalletServices from 'App/Services/WalletServices';

export default class WalletsController {

    public async show ({ response, auth }: HttpContextContract){
        let wallet = await WalletServices.getWallet(auth)
        await wallet.load('user', query => query.select('id','name'));
        return WalletServices.responding(response, 200, "user's wallet", {wallet});
    }
}
