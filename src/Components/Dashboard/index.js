import React from 'react'
import './index.css'
import CustomLoader from '../../Utilities/CustomLoader'
import {CheckAuth, GetAPI} from '../../https'
import Loading from '../Loading'
import Loadable from 'react-loadable'
import {codeToCurrency, currencyToCountry} from '../../constants'
import {Switch, Route, NavLink} from 'react-router-dom'
import LOGO from '../../Media/Images/Logo.png'
import CanadaLOGO from '../../Media/Images/CountryLogos/Canada.png'
import USALOGO from  '../../Media/Images/CountryLogos/United States.png'
import Notfound from '../Notfound'

const Notverified = Loadable({ loader: () => import('./Notverified'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Shop = Loadable({ loader: () => import('./Shop'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Payment = Loadable({ loader: () => import('./Payment'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Checkout = Loadable({ loader: () => import('./Checkout'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Result = Loadable({ loader: () => import('./Result'), loading: Loading, delay: 1000 })
const Account = Loadable({ loader: () => import('./Account'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Identity = Loadable({ loader: () => import('./Identity'), loading: Loading, delay: 1000 })
const ChangePassword = Loadable({ loader: () => import('./ChangePassword'), loading: Loading, delay: 1000 })
const OrderHistory = Loadable({ loader: () => import('./OrderHistory'), loading: Loading, delay: 1000 })
const Wallet = Loadable({ loader: () => import('./Wallet'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const WalletDetail = Loadable({ loader: () => import('./WalletDetail'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Deposit = Loadable({ loader: () => import('./Deposit'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Withdraw = Loadable({ loader: () => import('./Withdraw'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })

class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state={
            country: 'Canada',                                          // by default
            openCountrySelection: false,
            menuActive: false,
            username: null,
            emailVerified: false,
            kycVerified: false,
            kycCountry: null,
            promoInfo: null,
            brandInfo: null,
            showContent: false,                                  // when everything is done, show content
            openSearch: false,
            selectedBrand: null
        }
    }
    componentDidMount(){
        this.UserCheck()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    Path = ()=>{
        let url = window.location.href.split('/')
        url = url[url.length-1] === ''? url[url.length - 2] : url[url.length - 1]
        return url.toLowerCase()
    }
    UserCheck = async () =>{
        CheckAuth().then(response=>{
            if(!response.type)
                this.setState({showContent: true, username: response.username})  
            else if(response.type==='EMAIL_VERIFIED')
                this.setState({username: response.username, emailVerified: true}, this.GetPromo)
            else if(response.type==='VERIFIED_CA')
                this.setState({username: response.username, emailVerified: true, kycVerified:true, kycCountry: 'Canada'}, this.GetPromo)
            else if(response.type==='VERIFIED_US')
                this.setState({username: response.username, emailVerified: true, kycVerified:true, kycCountry: 'United States'}, this.GetPromo)
            else if(response.type==='KYC_VERIFIED')
                this.setState({username: response.username, emailVerified: true, kycVerified:true, kycCountry: 'Other'}, this.GetPromo)
            return null
        }).catch(this.Logout)
    }
    GetPromo = ()=>{
        GetAPI('users/list_coupons').then(response=>{
            this.setState({promoInfo: PromotionParse(response)}, this.GetBrands)
            return null
        }).catch(this.Logout)
    }
    GetBrands = ()=>{
        GetAPI('merchant/list_brands/country/ALL').then(response=>{
            this.setState({
                brandInfo: BrandParse(response.brands),
                showContent: true
            })
            return null
        }).catch(this.Logout)
    }
    Logout = ()=>{
        GetAPI('public/logout').then(()=>{
            this.props.history.push('/')
            return null
        }).catch(()=>{})
    }
    CountryChanged=()=>{
        this.setState({
            country: this.state.country === 'Canada' ? 'United States' : 'Canada',
            openCountrySelection: false
        })
    }
    SelectBrand = (value)=>{
        this.setState({
            selectedBrand: this.state.brandInfo.filter(item=>item.code === value)[0]
        },()=>this.props.history.push('/dashboard/payment'))
    }
    render(){
        if(!this.state.showContent)
            return  <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-normal)'/>
        else if(!this.state.emailVerified)
            return  <Notverified Logout={this.Logout}/>
        let menu = null
        let subMenu = null
        let menuActive = this.state.menuActive?"Active":""
        let countrySelectionPanel = null
        let path = this.Path()
        if(this.state.openCountrySelection)
            countrySelectionPanel = <div id='CountrySelection'>
                                                        <i className="fas fa-times" onClick={()=>this.setState({openCountrySelection: false})}></i>
                                                        <p><i className="far fa-compass"></i></p>
                                                        <p>You're shopping in<br/>{this.state.country}</p>
                                                        <p>Changing the country you shop from may affect the product price and availability.</p>
                                                        <button className='button-1' onClick={this.CountryChanged}>Shop{this.state.country==='Canada'?'United States':'Canada'}<i className="fas fa-arrow-right"></i></button>
                                                    </div>
        if(path === 'dashboard')
            subMenu =  <React.Fragment>
                                    <i className="fas fa-search" onClick={()=>this.setState({openSearch: true})}></i>
                                    <img src={this.state.country==='Canada'?CanadaLOGO:USALOGO} alt="" onClick={()=>this.setState({openCountrySelection: true})} />
                                </React.Fragment>
            if(path === 'account')
                subMenu = <div className='Logout' onClick={this.Logout}>
                                        <i className="fas fa-sign-out-alt"></i>
                                        <p>LOGOUT</p>
                                    </div>
            if(['dashboard', 'account', 'wallet'].includes(path))        // the condition can be optimized
                menu =  <div id='Dashboard-Menu'>
                                <div className='Bar'>
                                    <div className='Controller'>
                                        <i className="fas fa-bars" onClick={()=>this.setState(prevState=>({menuActive: !prevState.menuActive}))}></i>
                                        <span>{path}</span>
                                    </div>
                                    <div className='SubMenu'>
                                        {subMenu}
                                    </div>
                                    <div className='Bottom'>
                                        <img src={LOGO} alt="" />
                                    </div>
                                </div>
                                <div className={'Panel '+menuActive}>
                                    <NavLink exact to='/dashboard' onClick={()=>this.setState({menuActive: false})}>Shop</NavLink>
                                    <NavLink exact to='/dashboard/wallet' onClick={()=>this.setState({menuActive: false})}>Wallet</NavLink>
                                    <NavLink exact to='/dashboard/account' onClick={()=>this.setState({menuActive: false})}>Account</NavLink>
                                </div>
                            </div>
            return  <div id='Dashboard'>
                            {menu}
                            <Switch>
                                <Route exact path="/dashboard" render={(props)=> <Shop {...props} country={this.state.country} brandInfo={this.state.brandInfo} openSearch={this.state.openSearch} CloseSearch={()=>this.setState({openSearch: false})} SelectBrand={this.SelectBrand} />}/>
                                <Route exact path="/dashboard/map" render={(props)=> <Shop {...props} />}/>
                                <Route exact path="/dashboard/payment" render={(props)=> <Payment {...props} brandInfo={this.state.selectedBrand} promoInfo={this.state.promoInfo} ConfirmAmount={this.ConfirmAmount}/>}/>
                                <Route exact path="/dashboard/checkout" component={Checkout}/>
                                <Route exact path="/dashboard/result" component={Result}/>
                                <Route exact path="/dashboard/account" render={(props)=> <Account {...props} username={this.state.username} kycCountry={this.state.kycCountry} promoInfo={this.state.promoInfo}/>}/>
                                <Route exact path="/dashboard/identity" component={Identity}/>
                                <Route exact path="/dashboard/changepassword" component={ChangePassword}/>
                                <Route exact path="/dashboard/orderhistory" component={OrderHistory}/>
                                <Route exact path="/dashboard/wallet" render={(props)=> <Wallet {...props} kycVerified={this.state.kycVerified} kycCountry={this.state.kycCountry} />}/>
                                <Route exact path="/dashboard/walletdetail" render={(props)=> <WalletDetail {...props} kycVerified={this.state.kycVerified} kycCountry={this.state.kycCountry} />}/>
                                <Route exact path="/dashboard/deposit" render={(props)=> <Deposit {...props} kycVerified={this.state.kycVerified} />}/>
                                <Route exact path="/dashboard/withdraw" render={(props)=> <Withdraw {...props} kycVerified={this.state.kycVerified} />}/>
                                <Route component={Notfound}/>
                            </Switch>
                            {countrySelectionPanel}
                        </div>
    }
}

export default Dashboard

function PromotionParse(rawData){
    let temp = rawData.result[0]                               
    if(!temp)
        return {
            amount: 0,
            code: null,
            rate: 0
        }
    return {
        amount: temp.amount/100,
        code: temp.code,
        rate: Number(temp.discount)
    }
}

function BrandParse(rawData){
    let exceptions = [
        '???','brinker','americascores','charitychoice','cityyear','cleanwaterfund','codeorg','grameen','habitatforhumanity',
        'instedd','jhbloomberg','karmakarma','nationalpark','ride2recovery','specialolympics','summersearch','natureconservancy',
        'worldofchildren','bloomin','girlswhocode','landrys','americancs','huntsman'
    ]
    let newArray = []
    rawData.forEach(item=>{
        if(exceptions.includes(item.internal_id)){
            exceptions[exceptions.indexOf(item.internal_id)] = null
            return
        }
        let country = currencyToCountry[codeToCurrency[item.country]]
        if(item.denominations.indexOf('-')!== -1){
            let min = Number(item.denominations.split('-').shift())/100
            let max = Number(item.denominations.split('-').pop())/100
            newArray.push({
                index: item.index ? item.index : 9999,                      // this solution is just a placeholder here 
                code: item.internal_id, 
                name: item.brand_name, 
                country: country, 
                min: min, 
                max: max,
                acceptCents: item.openRange === false ? false : true,
                category: item.category
            }) 
        }
        else{
            let array = item.denominations.split(' ').map(item=>Number(item)/100)
            newArray.push({
                index: item.index ? item.index : 9999,                      // this solution is just a placeholder here 
                code: item.internal_id, 
                name: item.brand_name, 
                country: country, 
                array: array, 
                acceptCents: item.openRange === false ? false : true,
                category: item.category
            })
        }
    })
    newArray.sort((a, b)=>a.index - b.index)
    return newArray
}