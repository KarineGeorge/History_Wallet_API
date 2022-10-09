import WalletServices from "./WalletServices"
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import Transaction from 'App/Models/Transaction'
import Services from './Services';
import Wallet from "App/Models/Wallet";


export default class TransactionServices extends WalletServices{

    
    public static async createTransaction(data: {type: string; category: string; amount: number;}, walletId: number): Promise<Transaction> {
        return await Transaction.create({...data,walletId});
    }

    public static isEnoughBalance(type: string, amount: number, balance: number, response: ResponseContract): boolean{
        if((type=='expense') && (amount>balance)){
            Services.responding(response, 400, "not enough balance", {currentBalance: balance});
            return false;
        }
        return true;
    }

    public static isValidCategory(type: string, category: string, response: ResponseContract): boolean{
        if((type=="expense") && !(category=="expense")){
            Services.responding(response, 400, "invalid category for expense type", {expense_categories: ['expense']})
            return false
        }
        else if((type=="income") && (category=="expense")){
            Services.responding(response, 400, "invalid category for income type", {income_categories: ['salary','loan']})
            return false
        }
        return true
        
    }

    public static async getAllTransactions(auth: AuthContract): Promise<Transaction[]>{
        const wallet = await WalletServices.getWallet(auth);
        const transaction = await wallet.related('Transactions').query().orderBy('created_at', 'desc')
        return transaction
    }

    public static async getTransaction(auth: AuthContract, transactionId: number): Promise<Transaction>{
        const wallet = await WalletServices.getWallet(auth);
        const transaction = await wallet.related('Transactions').query().where('id', transactionId);
        return transaction[0]||undefined;
    }

    public static async getTransactionsByCategory(auth: AuthContract, category: string): Promise<Transaction[]>{
        let wallet = await WalletServices.getWallet(auth);
        const transactions = await wallet.related('Transactions').query().where('category', category).orderBy('created_at', 'desc');
        return transactions;
    }

    public static async getTransactionsByTime(auth: AuthContract,periode: string): Promise<Transaction[]>{
        const wallet = await WalletServices.getWallet(auth);
        let transactions;
        switch(periode){
            case "recent":
                transactions = await wallet.related('Transactions').query().orderBy('created_at', 'desc').orderBy('created_at', 'desc').groupLimit(10);
                break;
            case "today":
                transactions = await wallet.related('Transactions').query().whereRaw('Date(created_at) = CURRENT_DATE').orderBy('created_at', 'desc');
                break;
            case "week":
                transactions = await wallet.related('Transactions').query().whereRaw('Date(created_at) <= CURRENT_DATE OR Date(created_at) > CURRENT_DATE-7').orderBy('created_at', 'desc');
                break;    
            case "month":
                transactions = await wallet.related('Transactions').query().whereRaw('date_trunc(\'month\', created_at) = date_trunc(\'month\', CURRENT_DATE)').orderBy('created_at', 'desc');
                break;
        }
        return transactions;
    }

    public static async updateAmount(transaction: Transaction, wallet: Wallet, newAmount: number){
        if (transaction.type == "expense")
            wallet.balance += transaction.amount;
        else
            wallet.balance -= transaction.amount;
        await wallet.save();
        transaction.amount = newAmount;
        await transaction.save();
        await transaction.load('wallet', query => query.select('id','balance'));
    }

}