import REQUEST from "../../Services/Request"
import {ApiBaseUrl} from "../../Services/Config"

export const ADD_RECEIPT = async (data) => {
  return await REQUEST({
    method: "POST",
    url: ApiBaseUrl + `receipts`,
    data,
  }).catch((error) => console.log(error))
}
