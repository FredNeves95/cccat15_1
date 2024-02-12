import Ride from "../../domain/Ride";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide{
  constructor(readonly rideRepository: RideRepository){}

  async execute(rideId: string): Promise<Ride>{
    const ride = await this.rideRepository.get(rideId)
    if(!ride) throw new Error("Ride does not exist")
    return ride;
  }
}

