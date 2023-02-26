import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { GET_RECEIPTS } from "../pages/Receipts/Api";

export default function useGetReceiptsHook() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getUserId } = useContext(AuthContext);

  useEffect(() => {
    GET_RECEIPTS({ user: String(getUserId()) }).then((data) => {
      setData(data);
      setLoading(false);
      console.log(data, "get receipts data");
    });
  }, []);

  return [data, loading];
}
