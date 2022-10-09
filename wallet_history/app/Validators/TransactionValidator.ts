import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TransactionValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({

    type: schema.string({ trim: true }, [
      rules.required(),
      rules.regex(/^expense|income$/)
      ]),

    category: schema.string({ trim: true}, [
    rules.required(),
    rules.regex(/^expense|salary|loan$/)
    ]),

    amount: schema.number([
      rules.required()
      //rules.range(1,?)
    ])
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {

    required: '{{ field }} is required to add transaction',
    minLength: '{{ field }} must have minimum length of {{ options.minLength }}',
    maxLength: '{{ field }} can contain maximum length of {{ options.maxLength }}',
    regex: 'Enter a valid {{ field }}',
    
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    }

  }
}
