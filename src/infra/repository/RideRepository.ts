import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
  save: (ride: Ride) => Promise<void>;
  update: (rideId: string, driverId: string) => Promise<void>;
  get: (rideId: string) => Promise<Ride | undefined>;
  getActiveRidesByPassengerId: (passengerId: string) => Promise<Ride[]>;
  getActiveRidesByDriverId: (driverId: string) => Promise<Ride[]>;
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection){}
  async save(ride: Ride){
    await this.connection.query('insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)', [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date])
  }
  async update(rideId: string, driverId: string){
    await this.connection.query('update cccat15.ride set status = $1, driver_id = $2 where ride_id = $3', ["accepted", driverId,rideId])
  }
  async get(rideId: string){
    const [ride] = await this.connection.query('select * from cccat15.ride where ride_id = $1', [rideId])
    if(!ride) return
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.driver_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date);
  }
  async getActiveRidesByPassengerId(passengerId: string){
    const activeRidesData = await this.connection.query('select * from cccat15.ride where passenger_id = $1 and status = $2',[passengerId, "requested"])
    const activeRides: Ride[] = []
    for(const activeRideData of activeRidesData){
      activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, activeRideData.driver_id, parseFloat(activeRideData.from_lat), parseFloat(activeRideData.from_long), parseFloat(activeRideData.to_lat), parseFloat(activeRideData.to_long), activeRideData.status, activeRideData.date))
    }
    return activeRides
  }
  async getActiveRidesByDriverId(driverId: string){
    const activeRidesData = await this.connection.query('select * from cccat15.ride where driver_id = $1 and (status = $2 or status = $3)',[driverId, "accepted", "in_progress"])
    const activeRides: Ride[] = []
    for(const activeRideData of activeRidesData){
      activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, activeRideData.driver_id, parseFloat(activeRideData.from_lat), parseFloat(activeRideData.from_long), parseFloat(activeRideData.to_lat), parseFloat(activeRideData.to_long), activeRideData.status, activeRideData.date))
    }
    return activeRides
  }
}
