import GetAccount from "../../application/usecase/GetAccount";
import GetRide from "../../application/usecase/GetRide";
import HttpServer from "./HttpServer";
import RequestRide from "../../application/usecase/RequestRide";
import SignUp from "../../application/usecase/Signup";
import AcceptRide from "../../application/usecase/AcceptRide";

export default class MainController {
  constructor(httpServer: HttpServer, readonly signUp: SignUp, readonly getAccount: GetAccount, readonly requestRide: RequestRide, readonly getRide: GetRide, readonly acceptRide:  AcceptRide){
    httpServer.register("post", "/signup", async (params: any, body: any) => {
      const output = await signUp.execute(body)
      return output;
    })

    httpServer.register("get","/accounts/:accountId", async (params: any, body: any) => {
      const output = await getAccount.execute(params.accountId)
      return output;
    })

    httpServer.register("post", "/request_ride", async (params: any, body: any) => {
      const output = await requestRide.execute(body)
      return output;
    })

    httpServer.register("get","/rides/:rideId", async (params: any, body: any) => {
      const output = await getRide.execute(params.rideId)
      return output;
    })

    httpServer.register("post","/accept_ride/:rideId", async (params: any, body: any) => {
      const output = await acceptRide.execute({rideId: params.rideId, driverId: body.driverId})
      return output;
    })
  }

}