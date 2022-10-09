import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import Services from './Services'

class UsersServices extends Services {
    public static getUserId( auth: AuthContract ): number|undefined {
        const userId = auth.use('api').user?.id;
        return userId
    }

    public static async getUser( auth: AuthContract ): Promise<User> {
        const userId = this.getUserId(auth);
        return User.findOrFail(userId);
    }
}

export default UsersServices;

