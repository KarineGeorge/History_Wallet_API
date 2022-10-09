/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => { return "Welcome to Wallet" }) //done
Route.post('/signup', 'AuthController.register') //done
Route.post('/login', 'AuthController.login') //done

Route.group(() => {
  Route.get('/', 'UsersController.show') //done
  Route.delete('/', 'UsersController.destroy') //done
  Route.get('/wallet', 'WalletsController.show') //done

  Route.group(() => {
    Route.get('/', 'TransactionsController.index') //done
    Route.get('/:type', 'TransactionsController.indexByType').where('type', /^expense|income$/) //done
    Route.get('/:periode', 'TransactionsController.indexByTime').where('periode', /^recent|today|week|month$/) //done
    Route.get('/income/:category', 'TransactionsController.indexByCategory').where('category', /^salary|loan$/) //done
    Route.get('/view', 'TransactionsController.view') //done
    Route.get('/:id', 'TransactionsController.show') //done
    Route.post('/', 'TransactionsController.store') //done
    Route.put('/:id', 'TransactionsController.update') //done
    Route.delete('/:id', 'TransactionsController.destroy') //done
  }).prefix('/transactions')
}).prefix('/user').middleware('auth')

