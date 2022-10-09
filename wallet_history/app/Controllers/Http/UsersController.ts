import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserServices from 'App/Services/UserServices'

export default class UsersController {

    public async index({ response }: HttpContextContract){
        let users = User.all();
        return UserServices.responding(response,200,"All users",{ users });
    }

    public async show({ response, auth }: HttpContextContract){
        let user = await UserServices.getUser(auth);
        await user.load('wallet', query => query.preload('Transactions', query => query.orderBy('created_at', 'desc')).select('id','balance'));
        return UserServices.responding(response,200,"user's info",{ user });
    }

    public async destroy({ response, auth }: HttpContextContract){
        let user = await UserServices.getUser(auth);
        await user.delete();
        return UserServices.responding(response,204,"deleted",undefined);
    }

}
