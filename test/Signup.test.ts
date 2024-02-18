import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository'
import DatabaseConnection, { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import GetAccount from '../src/application/usecase/GetAccount'
import SignUp from '../src/application/usecase/Signup'

let connection: DatabaseConnection
let signUp: SignUp;
let getAccount: GetAccount;

beforeEach(() => {
	connection = new PgPromiseAdapter()
	const accountRepository = new AccountRepositoryDatabase(connection)
	signUp = new SignUp(accountRepository)
	getAccount = new GetAccount(accountRepository)
})

describe('Signup', () => {	
	it('should create a new passenger', async () => {
		const input = {
			name: 'John Doe',
			email: `${Math.random()}@email.com`,
			cpf: '97456321558',
			isPassenger: true
		}
		const { accountId } = await signUp.execute(input)
		const outputGetAccount = await getAccount.execute(accountId)
		expect(accountId).toBe(outputGetAccount.accountId)
		expect(input.name).toBe(outputGetAccount.getName())
		expect(input.email).toBe(outputGetAccount.getEmail())
		expect(input.cpf).toBe(outputGetAccount.getCpf())
		expect(input.isPassenger).toBe(outputGetAccount.isPassenger)
	})
	
	it('should create a new driver', async () => {
		const input = {
			name: 'John Doe',
			email: `${Math.random()}@email.com`,
			cpf: '97456321558',
			isDriver: true,
			carPlate: 'PWX6717'
		}
		const { accountId } = await signUp.execute(input)
		const outputGetAccount = await getAccount.execute(accountId)
		expect(accountId).toBe(outputGetAccount.accountId)
		expect(input.name).toBe(outputGetAccount.getName())
		expect(input.email).toBe(outputGetAccount.getEmail())
		expect(input.cpf).toBe(outputGetAccount.getCpf())
		expect(input.isDriver).toBe(outputGetAccount.isDriver)
		expect(input.carPlate).toBe(outputGetAccount.getCarPlate())
	})
	
	it('should throw error if name is invalid', async () => {
		const input = {
			name: 'John',
			email: `${Math.random()}@email.com`,
			cpf: '97456321558',
			isDriver: true,
			carPlate: 'PWX6717'
		}
		await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid name'))
	})
	
	it('should throw error if account already exists', async () => {
		const input = {
			name: 'John Doe',
			email: `${Math.random()}@email.com`,
			cpf: '97456321558',
			isDriver: true,
			carPlate: 'PWX6717'
		}
		await signUp.execute(input)
		await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Account already exists'))
	})
	
	it('should throw error if email is invalid', async () => {
		const input = {
			name: 'John Doe',
			email: `${Math.random()}`,
			cpf: '97456321558',
			isDriver: true,
			carPlate: 'PWX6717'
		}
		await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid email'))
	})
	
	it('should throw error if cpf is invalid', async () => {
		const input = {
			name: 'John Doe',
			email: `${Math.random()}@email.com`,
			cpf: '11111111111',
			isDriver: true,
			carPlate: 'PWX6717'
		}
		await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid cpf'))
	})
	
	it('should throw error if car plate is invalid', async () => {
		const input = {
			name: 'John Doe',
			email: `${Math.random()}@email.com`,
			cpf: '97456321558',
			isDriver: true,
			carPlate: 'PWX671'
		}
		await expect(() => signUp.execute(input)).rejects.toThrow(new Error('Invalid car plate'))
	})
})


afterEach(async () => {
	await connection.close()
})