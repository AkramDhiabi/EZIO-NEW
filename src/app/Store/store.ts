import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import {gemaltoaccountdata} from '../Reducers/reducer';



export let store = createStore(gemaltoaccountdata,applyMiddleware(thunk))

const unsubscribe=store.subscribe(()=>{
    
    console.log(store.getState());
})

