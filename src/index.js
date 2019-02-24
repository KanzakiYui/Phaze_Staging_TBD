import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
//import Compatibility from './Components/Compatibility'
import App from './Components'

// if(('serviceWorker' in navigator) || process.env.NODE_ENV === 'development'){
//     if('serviceWorker' in navigator)
//         navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`).then(function(){
//             console.log('Service Worker Registered')
//         }).catch(error=>console.log(error.message))
//     ReactDOM.render(<BrowserRouter basename="/app"><App/></BrowserRouter>, document.getElementById('root'))
// }
// else{
//     ReactDOM.render(<BrowserRouter basename="/app"><Compatibility/></BrowserRouter>, document.getElementById('root'))
// }

ReactDOM.render(<BrowserRouter basename="/app"><App/></BrowserRouter>, document.getElementById('root'))
