import { ApiBaseUrl } from "../../Services/Config";
import REQUEST from "../../Services/Request";

export async function EDIT_USER_DEVICES(data) {
  return await REQUEST({
    method: "PUT",
    url: ApiBaseUrl + `user`,
    data,
  }).catch((error) => console.log(error));
}
