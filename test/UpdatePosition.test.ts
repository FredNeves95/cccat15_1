import AcceptRide from "../src/application/usecase/AcceptRide"
import GetPositions from "../src/application/usecase/GetPositions"
import GetRide from "../src/application/usecase/GetRide"
import RequestRide from "../src/application/usecase/RequestRide"
import SignUp from "../src/application/usecase/Signup"
import StartRide from "../src/application/usecase/StartRide"
import UpdatePosition from "../src/application/usecase/UpdatePosition"
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection"
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository"
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepository"
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository"

let connection: PgPromiseAdapter 
let requestRide: RequestRide
let signUp: SignUp
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition
let getPositions: GetPositions

beforeEach(() => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection)
  const rideRepository = new RideRepositoryDatabase(connection)
	const positionRepository = new PositionRepositoryDatabase(connection)
  requestRide = new RequestRide(accountRepository, rideRepository)
  signUp = new SignUp(accountRepository)
  getRide = new GetRide(accountRepository, rideRepository)
	acceptRide = new AcceptRide(accountRepository, rideRepository)
	startRide = new StartRide(rideRepository)
	updatePosition = new UpdatePosition(rideRepository, positionRepository)
	getPositions = new GetPositions(positionRepository, rideRepository)
})


it("Should start a ride", async () => {
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
	const inputStartRide = {
		rideId
	}
	await startRide.execute(inputStartRide)
	const inputUpdatePosition = {
		rideId,
		lat: -27.496887588317275,
		long: -48.522234807851476
	}
	await updatePosition.execute(inputUpdatePosition)
	const outputGetRide = await getRide.execute(rideId)
	expect(outputGetRide.distance).toBe(10);
	expect(outputGetRide.lastLat).toBe(-27.496887588317275);
	expect(outputGetRide.lastLong).toBe(-48.522234807851476);
	const outputGetPositions = await getPositions.execute(rideId)
	expect(outputGetPositions.length).toBe(1);
	expect(outputGetPositions[0].positionId).toBeDefined();
	expect(outputGetPositions[0].lat).toBe(-27.496887588317275);
	expect(outputGetPositions[0].long).toBe(-48.522234807851476);
	expect(outputGetPositions[0].date).toBeDefined();
})

afterEach(() => {
  connection.close();
})