import AcceptRide from "../src/application/usecase/AcceptRide"
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
let acceptRide: AcceptRide
beforeEach(() => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection)
  const rideRepository = new RideRepositoryDatabase(connection)
  requestRide = new RequestRide(accountRepository, rideRepository)
  signUp = new SignUp(accountRepository)
  getRide = new GetRide(accountRepository, rideRepository)
	acceptRide = new AcceptRide(accountRepository, rideRepository)
})

afterEach(() => {
  connection.close();
})
it("Should accept a ride", async () => {
	const inputSignupPassenger = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUpPassenger = await signUp.execute(inputSignupPassenger)
	const outputSignUpPassenger = responseSignUpPassenger
	const inputRequestRide = {
		passengerId: outputSignUpPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	const responseRequestRide = await requestRide.execute(inputRequestRide)
	const outputRequestRide = responseRequestRide;
	const inputSignupDriver = {
		name: 'Another John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isDriver: true,
		carPlate: 'PWX6717'
	}
	const responseSignUpDriver = await signUp.execute(inputSignupDriver)
	const outputSignUpDriver = responseSignUpDriver
	const rideId = outputRequestRide.rideId
	const driverId = outputSignUpDriver.accountId
	const inputAcceptRide = {
		rideId,
		driverId
	}
	await acceptRide.execute(inputAcceptRide)
	const responseGetRide = await getRide.execute(rideId)
	const outputGetRide = responseGetRide;
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
	expect(outputGetRide.driverId).toBe(driverId)
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
	expect(outputGetRide.status).toBe('accepted')
})