import { useContext } from "react";
import { SnackContext } from "../providers/SnackProvider";


const useSnack = () => {
    return useContext(SnackContext)
};

export default useSnack;