import axios from "axios"

axios.defaults.validateStatus = () => {
	return true;
}

it('should create a new passenger', async () => {
	const input = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUp = await axios.post("http://localhost:3000/signup", input)
	const outputSignUp = responseSignUp.data
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignUp.accountId}`)
  const outputGetAccount = responseGetAccount.data
	expect(outputSignUp.accountId).toBe(outputGetAccount.accountId)
	expect(input.name).toBe(outputGetAccount.name)
	expect(input.email).toBe(outputGetAccount.email)
	expect(input.cpf).toBe(outputGetAccount.cpf)
	expect(input.isPassenger).toBe(outputGetAccount.isPassenger)
})

it('should request a ride', async () => {
	const inputSignup = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUp = await axios.post("http://localhost:3000/signup", inputSignup)
	const outputSignUp = responseSignUp.data
	const inputRequestRide = {
		passengerId: outputSignUp.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide)
	const outputRequestRide = responseRequestRide.data;
	expect(outputRequestRide.rideId).toBeDefined()
	const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`)
	const outputGetRide = responseGetRide.data;
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
	expect(outputGetRide.fromLat).toBe(-27.584905257808835)
	expect(outputGetRide.fromLong).toBe(-48.545022195325124)
	expect(outputGetRide.toLat).toBe(-27.496887588317275)
	expect(outputGetRide.toLong).toBe(-48.522234807851476)
	expect(outputGetRide.status).toBe('requested')
	expect(outputGetRide.date).toBeDefined()
})

it('should not request a ride if it is not a passenger', async () => {
	const inputSignup = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isDriver: true,
		carPlate: 'PWX6717'
	}
	const responseSignUp = await axios.post("http://localhost:3000/signup", inputSignup)
	const outputSignUp = responseSignUp.data
	const inputRequestRide = {
		passengerId: outputSignUp.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide)
	const outputRequestRide = responseRequestRide.data;
	expect(responseRequestRide.status).toBe(422);
	expect(outputRequestRide.message).toBe('Account is not from a passenger')
})
it('should not request a ride if passenger has another active ride', async () => {
	const inputSignup = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUp = await axios.post("http://localhost:3000/signup", inputSignup)
	const outputSignUp = responseSignUp.data
	const inputRequestRide = {
		passengerId: outputSignUp.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	await axios.post("http://localhost:3000/request_ride", inputRequestRide)
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide)
	const outputRequestRide = responseRequestRide.data;
	expect(responseRequestRide.status).toBe(422);
	expect(outputRequestRide.message).toBe('Passenger has an active ride')
})

it("Should accept a ride if driver_id is a driver and ride status is 'requested'", async () => {
	const inputSignupPassenger = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUpPassenger = await axios.post("http://localhost:3000/signup", inputSignupPassenger)
	const outputSignUpPassenger = responseSignUpPassenger.data
	const inputRequestRide = {
		passengerId: outputSignUpPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide)
	const outputRequestRide = responseRequestRide.data;
	expect(outputRequestRide.rideId).toBeDefined()

	const inputSignupDriver = {
		name: 'Another John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isDriver: true,
		carPlate: 'PWX6717'
	}
	const responseSignUpDriver = await axios.post("http://localhost:3000/signup", inputSignupDriver)
	const outputSignUpDriver = responseSignUpDriver.data
	expect(outputSignUpDriver.accountId).toBeDefined()

	const rideId = outputRequestRide.rideId
	const driverId = outputSignUpDriver.accountId
	const inputAcceptRide = {
		driverId
	}

	await axios.post(`http://localhost:3000/accept_ride/${rideId}`, inputAcceptRide)
	const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`)
	const outputGetRide = responseGetRide.data;
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
	expect(outputGetRide.driverId).toBe(driverId)
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
	expect(outputGetRide.fromLat).toBe(-27.584905257808835)
	expect(outputGetRide.fromLong).toBe(-48.545022195325124)
	expect(outputGetRide.toLat).toBe(-27.496887588317275)
	expect(outputGetRide.toLong).toBe(-48.522234807851476)
	expect(outputGetRide.status).toBe('accepted')
	expect(outputGetRide.date).toBeDefined()
})

it("should not accept a ride if ride status isn't requested", async () => {
	const inputSignupPassenger = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUpPassenger = await axios.post("http://localhost:3000/signup", inputSignupPassenger)
	const outputSignUpPassenger = responseSignUpPassenger.data
	const inputRequestRide = {
		passengerId: outputSignUpPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide)
	const outputRequestRide = responseRequestRide.data;
	expect(outputRequestRide.rideId).toBeDefined()

	const inputSignupFirstDriver = {
		name: 'Another John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isDriver: true,
		carPlate: 'PWX6717'
	}
	const responseSignUpFirstDriver = await axios.post("http://localhost:3000/signup", inputSignupFirstDriver)
	const outputSignUpFirstDriver = responseSignUpFirstDriver.data
	expect(outputSignUpFirstDriver.accountId).toBeDefined()

	const inputSignupSecondDriver = {
		name: 'Another John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isDriver: true,
		carPlate: 'PWX6717'
	}
	const responseSignUpSecondDriver = await axios.post("http://localhost:3000/signup", inputSignupSecondDriver)
	const outputSignUpSecondDriver = responseSignUpSecondDriver.data
	expect(outputSignUpSecondDriver.accountId).toBeDefined()

	const rideId = outputRequestRide.rideId
	const firstDriverId = outputSignUpFirstDriver.accountId
	const secondDriverId = outputSignUpFirstDriver.accountId

	const inputFirstAcceptRide = {
		driverId: firstDriverId
	}

	const inputSecondAcceptRide = {
		driverId: secondDriverId
	}

	await axios.post(`http://localhost:3000/accept_ride/${rideId}`, inputFirstAcceptRide)
	const responseAcceptRide = await axios.post(`http://localhost:3000/accept_ride/${rideId}`, inputSecondAcceptRide)
	const outputAcceptRide = responseAcceptRide.data;
	expect(responseAcceptRide.status).toBe(422);
	expect(outputAcceptRide.message).toBe('Ride is not available')
})

it("should not accept a ride if driver has a ride accepted or in progress", async () => {
	const inputSignupFirstPassenger = {
		name: 'John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isPassenger: true
	}
	const responseSignUpFirstPassenger = await axios.post("http://localhost:3000/signup", inputSignupFirstPassenger)
	const outputSignUpFirstPassenger = responseSignUpFirstPassenger.data
	const inputRequestFirstRide = {
		passengerId: outputSignUpFirstPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	const responseRequestFirstRide = await axios.post("http://localhost:3000/request_ride", inputRequestFirstRide)
	const outputRequestFirstRide = responseRequestFirstRide.data;
	expect(outputRequestFirstRide.rideId).toBeDefined()

	const inputSignupSecondPassenger = {
		name: 'Another John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '71428793860',
		isPassenger: true
	}
	const responseSignUpSecondPassenger = await axios.post("http://localhost:3000/signup", inputSignupSecondPassenger)
	const outputSignUpPassenger = responseSignUpSecondPassenger.data
	const inputRequestSecondRide = {
		passengerId: outputSignUpPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476,
	}
	const responseRequestSecondRide = await axios.post("http://localhost:3000/request_ride", inputRequestSecondRide)
	const outputRequestSecondRide = responseRequestSecondRide.data;
	expect(outputRequestSecondRide.rideId).toBeDefined()

	const inputSignupDriver = {
		name: 'Another John Doe',
		email: `${Math.random()}@email.com`,
		cpf: '97456321558',
		isDriver: true,
		carPlate: 'PWX6717'
	}
	const responseSignUpDriver = await axios.post("http://localhost:3000/signup", inputSignupDriver)
	const outputSignUpDriver = responseSignUpDriver.data
	expect(outputSignUpDriver.accountId).toBeDefined()

	const firstRideId = outputRequestFirstRide.rideId
	const secondRideId = outputRequestSecondRide.rideId
	const driverId = outputSignUpDriver.accountId
	const inputAcceptRide = {
		driverId
	}

	await axios.post(`http://localhost:3000/accept_ride/${firstRideId}`, inputAcceptRide)
	const responseAcceptRide = await axios.post(`http://localhost:3000/accept_ride/${secondRideId}`, inputAcceptRide)
	const outputAcceptRide = responseAcceptRide.data;
	expect(responseAcceptRide.status).toBe(422);
	expect(outputAcceptRide.message).toBe('Driver already has a current ride')
})