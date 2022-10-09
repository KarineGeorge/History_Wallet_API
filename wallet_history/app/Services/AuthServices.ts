import User from 'App/Models/User'
import Wallet from 'App/Models/Wallet'
import Services from './Services';

export default class AuthServices extends Services{

    public static async createUser(data: { name: string; phoneNumber: string; email: string; password: string;}): Promise<User> {
        let newUser = new User();
        newUser.name = data.name;
        newUser.phoneNumber = data.phoneNumber;
        newUser.email = data.email;
        newUser.password = data.password;
        await newUser.save();
        return newUser;
    }

    public static async createWallet(userId: number): Promise<Wallet> {
        let newWallet = new Wallet();
        newWallet.userId = userId;
        newWallet.balance = 0;
        await newWallet.save();
        return newWallet;
    }
}