import CarPlate from "../valueObjects/CarPlate";
import Cpf from "../valueObjects/Cpf";
import Email from "../valueObjects/Email";
import Name from "../valueObjects/Name";
import crypto from 'crypto'

// Entity
export default class Account {
  private name: Name
  private email: Email
  private cpf: Cpf
  private carPlate?: CarPlate
  private constructor(readonly accountId: string, name: string, email: string, cpf: string,
    readonly isDriver: boolean, readonly isPassenger: boolean, carPlate?: string){
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
		if (isDriver && carPlate){
      this.carPlate = new CarPlate(carPlate);
    }
  }

  static create(name: string, email: string, cpf: string,
    isDriver: boolean, isPassenger: boolean, carPlate?: string){
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
  }

  static restore(accountId: string, name: string, email: string, cpf: string,
    isDriver: boolean, isPassenger: boolean, carPlate?: string){
    return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
  }

  

  getName(){
    return this.name.getValue();
  }

  getEmail(){
    return this.email.getValue();
  }

  getCpf(){
    return this.cpf.getValue();
  }

  getCarPlate(){
    return this.carPlate?.getValue();
  }
}