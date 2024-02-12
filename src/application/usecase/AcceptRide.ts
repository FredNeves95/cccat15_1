import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
  constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository){}
  async execute(rideId: string, driverId: string){
    const account = await this.accountRepository.getById(driverId);
    if(!account) throw new Error("Account not found");
    if(!account.isDriver) throw new Error("User is not a driver");
    const ride = await this.rideRepository.get(rideId)
    if(!ride) throw new Error("Ride not found");
    if(ride.status !== "requested") throw new Error("Ride is not available")
    const [activeRideByDriver] = await this.rideRepository.getActiveRidesByDriverId(driverId)
    if(activeRideByDriver) throw new Error("Driver already has a current ride")
    await this.rideRepository.update(rideId, driverId)
  }
}