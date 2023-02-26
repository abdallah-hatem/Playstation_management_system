import REQUEST from "../../Services/Request";
import { ApiBaseUrl } from "../../Services/Config";

export async function LOGIN(data) {
  return await REQUEST({
    method: "POST",
    url: ApiBaseUrl + `login`,
    data,
  }).catch((error) => console.log(error));
}
