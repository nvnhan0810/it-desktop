import { useAppSelector } from "@/store/hooks";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const AuthHeaderIcon = () => {
    const user = useAppSelector((state) => state.auth.user);

    const handleLogin = () => {
        window.electron.startLogin();
    }

    return user == null ? (
        <CircleUser onClick={handleLogin} size={20} />
    ) : (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>AV</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default AuthHeaderIcon;