// import { Admin } from "../../../domain/entities/Admin";
// import { Merchant } from "../../../domain/entities/User";
// import { Pagination } from "../../../domain/entities/Pagination";
// import { Store } from "../../../domain/entities/Store";
// import { SuperAdmin } from "../../../domain/entities/SuperAdmin";
// import { AppUser } from "../../../domain/entities/Types";

// export default class ListStore {
//   public async execute(by: AppUser, pagination: Pagination, filters: { [index: string]: string }): Promise<Store[]> {
//     if (by instanceof Merchant) {
//       return Promise.resolve(by.stores)
//     }
//     if (by instanceof SuperAdmin || by instanceof Admin) {
//       throw new Error('not implemented')
//     }
//     return []
//   }
// }