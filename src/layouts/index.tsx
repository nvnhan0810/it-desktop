import useRenderedEffect from "@/hooks/useRenderedEffect";
import { useAppDispatch } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout: FC<PropsWithChildren> = () => {
    const dispatch = useAppDispatch();
    const [token, setToken] = useState(localStorage.getItem('AUTH_TK'));

    useRenderedEffect(() => {
        initAuth();
    }, [token]);

    // Handle Auth Event
    useEffect(() => {
        window.electron.onLoginSuccess((data) => {
            localStorage.setItem("AUTH_TK", data.access_token);
            localStorage.setItem("AUTH_REF_TK", data.refresh_token);
            setToken(data.access_token);
        });

        window.electron.onLoginFailure((err) => {
            alert(err);
        });
    }, []);

    const initAuth = () => {
        if (token && token !== undefined) {
            return dispatch(fetchProfile());
        }
    };

    return <Outlet />;
}

export default DefaultLayout;