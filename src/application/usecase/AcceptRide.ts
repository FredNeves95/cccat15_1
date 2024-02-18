import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
  constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository){}
  async execute(input: Input){
    const { driverId, rideId } = input
    const account = await this.accountRepository.getById(driverId);
    if(!account) throw new Error("Account not found");
    if(!account.isDriver) throw new Error("User is not a driver");
    const ride = await this.rideRepository.get(rideId)
    if(!ride) throw new Error("Ride not found");
    const [activeRideByDriver] = await this.rideRepository.getActiveRidesByDriverId(driverId)
    if(activeRideByDriver) throw new Error("Driver already has a current ride")
    ride.accept(driverId)
    await this.rideRepository.update(ride)
  }
}

type Input = {
  rideId: string,
  driverId: string
}