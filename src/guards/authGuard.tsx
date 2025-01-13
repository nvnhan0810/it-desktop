import { useAppSelector } from "@/store/hooks";
import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const AuthGuard : FC<PropsWithChildren> = ({ children }) => {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/" />
    }

    return <>{children}</>;
}

export default AuthGuard;