import SignUp from "./application/usecase/Signup"
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository"
import GetAccount from "./application/usecase/GetAccount"
import RequestRide from "./application/usecase/RequestRide"
import { RideRepositoryDatabase } from "./infra/repository/RideRepository"
import GetRide from "./application/usecase/GetRide"
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection"
import { ExpressAdapter } from "./infra/http/HttpServer"
import MainController from "./infra/http/MainController"
import AcceptRide from "./application/usecase/AcceptRide"

const httpServer = new ExpressAdapter()
const connection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const rideRepository = new RideRepositoryDatabase(connection)
const signUp = new SignUp(accountRepository)
const getAccount = new GetAccount(accountRepository)
const requestRide = new RequestRide(accountRepository, rideRepository)
const getRide = new GetRide(accountRepository, rideRepository)
const acceptRide = new AcceptRide(accountRepository, rideRepository)
new MainController(httpServer, signUp, getAccount, requestRide, getRide, acceptRide)
httpServer.listen(3000)