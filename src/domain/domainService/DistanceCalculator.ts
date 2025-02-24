import Coord from "../valueObjects/Coord";

// Domain Service
export default class DistanceCalculator  {
  private constructor(){}

  static calculate(from: Coord, to: Coord) {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180
    const deltaLat = (to.getLat() - from.getLat()) * degreesToRadians;
    const deltaLong = (to.getLong() - from.getLong()) * degreesToRadians;
    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(from.getLat() * degreesToRadians) * Math.cos(to.getLat()*degreesToRadians) *
        Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Math.round(earthRadius * c); // Distance in kilometers
    return distance;
  }
}