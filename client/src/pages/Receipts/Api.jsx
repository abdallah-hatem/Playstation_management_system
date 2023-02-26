import REQUEST from "../../Services/Request";
import { ApiBaseUrl } from "../../Services/Config";

export async function GET_RECEIPTS(data) {
  return await REQUEST({
    method: "POST",
    url: ApiBaseUrl + "get-receipts",
    data,
  }).catch((error) => console.log(error));
}

export async function DELETE_RECEIPT_BY_ID(id) {
  return await REQUEST({
    method: "DELETE",
    url: ApiBaseUrl + `receipts/${id}`,
  }).catch((error) => console.log(error));
}
