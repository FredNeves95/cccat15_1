import Cpf from "../src/domain/valueObjects/Cpf";

describe('Cpf', () => {
	it.each([
		"97456321558",
		"71428793860",
		"87748248800"
	])("Should return value if cpf is valid", function (cpf: string) {
		
		expect(new Cpf(cpf)).toBeDefined();
	});
	
	it.each([
		"8774824880",
		null,
		undefined,
		"11111111111"
	])("Should throw error if cpf is invalid", function (cpf: any) {
		expect(() => new Cpf(cpf)).toThrow('Invalid cpf');
	});
})
