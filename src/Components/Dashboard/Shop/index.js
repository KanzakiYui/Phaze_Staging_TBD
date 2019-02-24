import React from 'react'
import './index.css'
import {Switch, Route} from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '../../Loading'

const Grid = Loadable({ loader: () => import('./Grid'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Map = Loadable({ loader: () => import('./Map'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })

class Shop extends React.Component{
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    render(){
        return  <div id='Shop'>
                        <Switch>
                            <Route exact path="/dashboard" render={(props)=> <Grid {...props} country={this.props.country} brandInfo={this.props.brandInfo} openSearch={this.props.openSearch} CloseSearch={this.props.CloseSearch} SelectBrand={this.props.SelectBrand}/>} />
                            <Route exact path="/dashboard/map" render={(props)=> <Map {...props} brandInfo={this.props.brandInfo}/>} />
                        </Switch> 
                    </div>
    }
}

export default Shop