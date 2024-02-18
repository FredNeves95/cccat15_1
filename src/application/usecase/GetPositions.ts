import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetPositions {
  constructor(readonly positionsRepository: PositionRepository, readonly rideRepository: RideRepository){}

  async execute(rideId: string): Promise<Output[]>{
    const ride = await this.rideRepository.get(rideId)
    if(!ride) throw new Error("Ride does not exist")
    const positions = await this.positionsRepository.listByRideId(rideId)
    if(!positions) throw new Error("Positions do not exist")
    return positions.map(position => ({
      positionId: position.positionId,
      rideId: ride.rideId,
      lat: position.getLat(),
      long: position.getLong(),
      date: position.date,
    }))
  }
}

type Output = {
  positionId: string,
  rideId: string,
  lat: number,
  long: number,
  date: Date,
}