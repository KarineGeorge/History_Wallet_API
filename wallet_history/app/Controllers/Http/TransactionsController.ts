import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TransactionValidator from 'App/Validators/TransactionValidator'
import UpdateTransactionValidator from 'App/Validators/UpdateTransactionValidator'
import TransactionServices from 'App/Services/TransactionServices'

export default class TransactionsController {

    public async index({ response, auth }: HttpContextContract) {
        const transactions = await TransactionServices.getAllTransactions(auth);
        return TransactionServices.responding(response, 200, "All Transactions List", { transactions });
    }

    public async indexByType({ response, auth, params }: HttpContextContract) {
        let wallet = await TransactionServices.getWallet(auth);
        const transactions = await wallet.related('Transactions').query().where('type', params.type).orderBy('created_at', 'desc');
        return TransactionServices.responding(response, 200, `${params.type} Transactions List`, { transactions });
    }

    public async indexByCategory({ response, auth, params }: HttpContextContract) {
        const transactions = await TransactionServices.getTransactionsByCategory(auth, params.category);
        return TransactionServices.responding(response, 200, `${params.category} Transactions List`, { transactions });
    }

    public async indexByTime({ params, auth, response }: HttpContextContract) {
        let transactions = await TransactionServices.getTransactionsByTime(auth, params.periode);
        return TransactionServices.responding(response, 200, `${params.periode} Transactions List`, { transactions });
    }

    public async show({ params, auth, response}: HttpContextContract){
        const transaction = await TransactionServices.getTransaction(auth, params.id);
        if(transaction==undefined)
            return TransactionServices.responding(response, 400, `No such transaction`, undefined)
        return TransactionServices.responding(response, 200, `Transaction number ${params.id}`, {transaction:transaction.$attributes})
    }

    public async view({ auth, response }: HttpContextContract) {
        const category = ['expense', 'salary', 'loan'];
        let view = {};
        for (let i = 0; i < category.length; i++) {
            const transactions = await TransactionServices.getTransactionsByCategory(auth, category[i]);
            let numberOfTransactions = transactions.length;
            let totalAmount = 0;
            transactions.forEach(transaction => { totalAmount += transaction.amount });
            view[category[i]] = { numberOfTransactions, totalAmount };
        }
        return TransactionServices.responding(response, 200, "View Transactions", { view });
    }

    public async store({ request, response, auth }: HttpContextContract) {

        let data = await request.validate(TransactionValidator);
        if (!TransactionServices.isValidCategory(data.type, data.category, response))
            return

        const wallet = await TransactionServices.getWallet(auth);
        if (!TransactionServices.isEnoughBalance(data.type, data.amount, wallet.balance, response))
            return

        const newTransaction = await TransactionServices.createTransaction(data, wallet.id)
        await newTransaction.load('wallet', query => query.select('id','balance'));
        return TransactionServices.responding(response, 201, "created", { newTransaction });
    }

    public async update({ params, auth, request, response }: HttpContextContract) {

        let data = await request.validate(UpdateTransactionValidator);
        const wallet = await TransactionServices.getWallet(auth);
        const transaction = await TransactionServices.getTransaction(auth, params.id);
        if(transaction==undefined)
            return TransactionServices.responding(response, 400, `No such transaction`, undefined)

        if (!TransactionServices.isEnoughBalance(transaction.type, data.amount, wallet.balance, response))
            return

        await TransactionServices.updateAmount(transaction, wallet, data.amount)
        return TransactionServices.responding(response, 200, "updated", { transaction })

    }

    public async destroy({ params, auth, response }: HttpContextContract) {
        const transaction = await TransactionServices.getTransaction(auth, params.id);
        if(transaction==undefined)
            return TransactionServices.responding(response, 400, `No such transaction`, undefined)
            
        await transaction.delete();
        return TransactionServices.responding(response, 204, "Deleted", undefined);
    }
}
