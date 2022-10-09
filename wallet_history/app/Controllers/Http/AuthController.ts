import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/RegisterValidator'
import LoginValidator from 'App/Validators/LoginValidator'
import AuthServices from 'App/Services/AuthServices'

export default class AuthController {

    public async register({ request, response }: HttpContextContract){
        let data = await request.validate(RegisterValidator)
        const newUser = await AuthServices.createUser(data)
        const newWallet = await AuthServices.createWallet(newUser.id)
        return AuthServices.responding(response,201,"created",{ newUser, newWallet })
    }

    public async login({ request, response, auth}: HttpContextContract){
        let data = await request.validate(LoginValidator)
        const token = await auth.use('api').attempt(data.phoneNumber || data.email, data.password)   
        return AuthServices.responding(response,200,"logged in successfully",{token})
    }
}
