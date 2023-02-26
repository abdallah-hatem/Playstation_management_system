import REQUEST from "../../Services/Request";
import { ApiBaseUrl } from "../../Services/Config";

export async function SIGN_UP(data) {
  return await REQUEST({
    method: "POST",
    url: ApiBaseUrl + `signup`,
    data,
  }).catch((error) => console.log(error));
}
