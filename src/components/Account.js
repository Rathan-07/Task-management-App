import { useAuth } from "./context/AuthContext"
export default function Account(){
    const {user} = useAuth()
    return (
        <div>
            <h2>Account</h2>
            {user && (
                <>
                <p>Username - {user?.account?.username}</p>
                <p>email - {user?.account?.email}</p>
                <p>Role - {user?.account?.role}</p>
                </>
            )}
        </div>
    )

}