import AccountRepository from "../../infra/repository/AccountRepository";
import Account from "../../domain/entities/Account";
export default class SignUp {
	constructor(readonly accountRepository: AccountRepository){}
	async execute(input: any){
		const existingAccount = await this.accountRepository.getByEmail(input.email);
		if (existingAccount) throw new Error('Account already exists')
		const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate)
		await this.accountRepository.save(account)
		return {
			accountId: account.accountId
		}
	}
}
