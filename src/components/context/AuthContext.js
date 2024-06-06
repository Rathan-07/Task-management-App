import { createContext, useContext, useReducer} from 'react'


const AuthContext = createContext()

export const useAuth = ()=>{
    return useContext(AuthContext)
}

const reducer = (state,action)=>{
    switch(action.type){
        case 'LOGIN':{
            return {...state, isLoggedIn:true,account:action.payload.account}
        }
        case 'LOGOUT':{
            return {...state,isLoggedIn:false,account:null}
        }
        case 'TASK':{
              return {...state,isLoggedIn:true,task:action.payload}
        }
       
        default:{
            return {...state}
        }
     }
    }

export const AuthProvider = ({children})=>{
    const [user,dispatch] = useReducer(reducer,{
        isLoggedIn:false,
        account:null,
        task:null
    })
    return (
        <AuthContext.Provider value={{user,dispatch}}>
         {children}
        </AuthContext.Provider>
    )

}