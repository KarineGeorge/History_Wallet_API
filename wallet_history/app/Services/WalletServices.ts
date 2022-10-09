import UserServices from "./UserServices";
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Wallet from 'App/Models/Wallet'
import Services from "./Services";

export default class WalletServices extends Services {

    public static async getWallet(auth: AuthContract): Promise<Wallet> {
        const userId = UserServices.getUserId(auth);
        return await Wallet.findByOrFail('userId',userId);
    }

}
