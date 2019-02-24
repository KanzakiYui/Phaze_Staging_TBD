import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Loadable from 'react-loadable'
import Load from './Loading'

const Login = Loadable({ loader: () => import('./Login'), loading: Load, delay: 1000 })
const Signup = Loadable({ loader: () => import('./Signup'), loading: Load, delay: 1000 })
const Forgot = Loadable({ loader: () => import('./Forgot'), loading: Load, delay: 1000 })
const Notfound = Loadable({ loader: () => import('./Notfound'), loading: Load, delay: 1000 })
const Dashboard = Loadable({ loader: () => import('./Dashboard'), loading: Load, delay: 1000 })
const EmailVerify = Loadable({ loader: () => import('./EmailVerify'), loading: Load, delay: 1000 })

class App extends React.Component{
    render(){
        return  <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/index.html" component={Login}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/signup/:code" component={Signup}/>
                        <Route exact path="/signup" component={Signup}/>
                        <Route exact path="/forgot/:code" component={Forgot}/>
                        <Route exact path="/forgot" component={Forgot}/>
                        <Route exact path="/emailverify/:code" component={EmailVerify}/>
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route component={Notfound}/>
                    </Switch>
    }
}

export default App