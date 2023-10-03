import {  useQuery } from "@apollo/client";
import { GET_USER } from "../queries/user";
import useAuth from "./useAuth";

const useUser = () => {
    const { user, loading } = useAuth();
    const {data, loading: userLoading, error, refetch} = useQuery(GET_USER, {
        variables: {email: user?.email},
        skip: !user || loading
    });

    return {
        userInfo: data ? data.user : null,
        userInfoLoading: loading || userLoading,
        userInfoError: error,
        refetch,
        ...data?.user
    }
};

export default useUser;