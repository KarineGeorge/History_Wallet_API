import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
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
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(1),
      rules.regex(/^[a-zA-Z]+$/)
    ]),

    phoneNumber: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ table: 'users', column: 'phone_number'}),
      rules.maxLength(11),
      rules.minLength(11),
      rules.regex(/^[0-9]+$/)
    ]),

    email: schema.string({ trim: true }, [
        rules.required(),
        rules.unique({ table: 'users', column: 'email'}),
        rules.minLength(12),
        rules.maxLength(255),
        //rules.email()
    ]),

    password: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(1)
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

    required: '{{ field }} is required to sign up',
    minLength: '{{ field }} must have minimum length of {{ options.minLength }}',
    maxLength: '{{ field }} can contain maximum length of {{ options.maxLength }}',
    regex: 'Enter a valid {{ field }}',
  
    'email.unique': 'This email is registered already',
    'phoneNumber.unique': 'This phone number is registered already',
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    }
    
  }
}
