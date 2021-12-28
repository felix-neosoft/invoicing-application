const USER_LOGIN = 'USER_LOGIN'

export const userLogin = (status,token) => {
    return{
        type: USER_LOGIN,
        payload: {"token":token,"status":status}
    } 
}

const initialValue = {
    status:'NOT_LOGGED',
    token:''
}

const userReducer = ( state = initialValue, action) =>{
    switch(action.type){
        case USER_LOGIN: return{
            ...state,status:action.payload.status,token:action.payload.token
        }
        default: return state
    }
}

export default userReducer