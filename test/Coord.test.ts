import Coord from "../src/domain/valueObjects/Coord";
type Coordinates = {
  lat: number;
  long: number;
}
describe('Coordinates', () => {
	it.each([
		{lat: -90, long: -180},
		{lat: -10, long: 18},
		{lat: 90, long: 180}
	])("Should return value if coordinates are valid",  ({lat, long}: Coordinates)  =>{
		
		expect(new Coord(lat, long)).toBeDefined();
	});
	
	it.each([
		{lat: -91, long: -180},
		{lat: 91, long: 180}
	])("Should throw error if latitude is invalid",  ({lat, long}: Coordinates) => {
		expect(() => new Coord(lat, long)).toThrow('Invalid latitude');
	});

  it.each([
		{lat: -90, long: -181},
		{lat: 90, long: 181}
	])("Should throw error if longitude is invalid",  ({lat, long}: Coordinates) => {
		expect(() => new Coord(lat, long)).toThrow('Invalid longitude');
	});
})