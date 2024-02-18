import GetRide from "../src/application/usecase/GetRide"
import RequestRide from "../src/application/usecase/RequestRide"
import SignUp from "../src/application/usecase/Signup"
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection"
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository"
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository"

let connection: PgPromiseAdapter 
let requestRide: RequestRide
let signUp: SignUp
let getRide: GetRide

beforeEach(() => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection)
  const rideRepository = new RideRepositoryDatabase(connection)
  requestRide = new RequestRide(accountRepository, rideRepository)
  signUp = new SignUp(accountRepository)
  getRide = new GetRide(accountRepository, rideRepository)
})

afterEach(() => {
  connection.close();
})
it('should request a ride', async () => {
	const inputSignup = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUp = await signUp.execute(inputSignup)
	const outputSignUp = responseSignUp
	const inputRequestRide = {
		passengerId: outputSignUp.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}

	const responseRequestRide = await requestRide.execute(inputRequestRide)

	const outputRequestRide = responseRequestRide;
	expect(outputRequestRide.rideId).toBeDefined()
	const responseGetRide = await getRide.execute(outputRequestRide.rideId)
	const outputGetRide = responseGetRide;
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
	expect(outputGetRide.fromLat).toBe(-27.584905257808835)
	expect(outputGetRide.fromLong).toBe(-48.545022195325124)
	expect(outputGetRide.toLat).toBe(-27.496887588317275)
	expect(outputGetRide.toLong).toBe(-48.522234807851476)
	expect(outputGetRide.status).toBe('requested')
	expect(outputGetRide.date).toBeDefined()
})
