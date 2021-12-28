import { createStore} from 'redux'
import {combineReducers} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'

//reducers 
import userReducer from './userReducer'
import invoiceReducer from './invoiceReducer'

const rootReducer = combineReducers({
    user: userReducer,
    invoice: invoiceReducer
})

const store = createStore(rootReducer,composeWithDevTools())

export default store