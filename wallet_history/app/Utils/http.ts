import { ResponseContract } from '@ioc:Adonis/Core/Response'


export default class http {

    public responding( response: ResponseContract, status: number, message: string, json: object | undefined){
        if(json === undefined){
            return response.status(status).json({message})
        }
        return response.status(status).json({...json, message})
    }

}