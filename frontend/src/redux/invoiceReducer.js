const ADD_RECEIVER = 'ADD_RECEIVER' 
const ADD_PRODUCT = 'ADD_PRODUCT'
const DELETE_PRODUCT = 'DELETE_PRODUCT'
const RESET_STATE = 'RESET_STATE'
const SET_STATE = 'SET_STATE'

export const addReceiver = (data) => {
    return{
        type: ADD_RECEIVER,
        payload: data
    } 
}

export const setState = (data) => {
    return{
        type: SET_STATE,
        payload:data
    }
}

export const addProduct = (data) => {
    return{ 
        type: ADD_PRODUCT,
        payload: data
    }
}

export const  resetState = () =>{
    return{
        type:RESET_STATE
    }
}

export const deleteProduct = (item) =>{
    return{
        type: DELETE_PRODUCT,
        payload:item
    }
}

const initialValue = {
    receiver_email:'',
    receiver_name:'',
    receiver_address:'',
    invoice_date:'',
    due_date:'',
    status:'',
    products:[]  
}

const invoiceReducer = ( state = initialValue, action) =>{
    switch(action.type){
        case ADD_RECEIVER: return{
            ...state,
            receiver_email:action.payload.receiver_email,
            receiver_name:action.payload.receiver_name,
            receiver_address:action.payload.receiver_address,
            invoice_date:action.payload.invoice_date,
            due_date:action.payload.due_date,
            status:'UNPAID'
        } 

        case ADD_PRODUCT:
            let data = state.products || []
            data.push(action.payload)
            return{...state,products:data}

        case DELETE_PRODUCT:
            let deldata = state.products
            deldata.splice(action.payload,1)
            return{...state,products:deldata}

        case RESET_STATE: return {
            state:initialValue
        }

        case SET_STATE: return {
            ...state,
            receiver_name:action.payload.receiver_name,
            receiver_address:action.payload.receiver_address,
            invoice_date:action.payload.invoice_date,
            due_date:action.payload.due_date,
            status:action.payload.status,
            products:action.payload.products  
        }

        default: return state
    }
}

export default invoiceReducer

