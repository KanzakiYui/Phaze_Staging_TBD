import React from 'react'
import './index.css'
import GiftCard from '../GiftCard'
import CryptoCard from '../CryptoCard'
import {GetAPI, GetOther, POSTAPI} from '../../../https'
import Debounce from '../../../Utilities/Debounce'
import {walletToCode, countryToCode, codeToCurrency} from '../../../constants'
import Loader from 'react-loader-spinner'

class Checkout extends React.Component{
    constructor(props){
        super(props)
        this.state={
            balance: { 'Bitcoin': 0, 'Ethereum': 0, 'Litecoin': 0},
            method: 'Bitcoin',
            rate: 0,
            payError: false,                                                
            errorMessage: null,
            loading: false
        }
        this.currency = ''
    }
    componentDidMount(){
        if(!this.props.location.state){
            this.props.history.push('/dashboard')
            return
        }
        this.currency = codeToCurrency[countryToCode[this.props.location.state.country]]
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
        this.GetBalance()
        this.GetRate()          // Call once
    }
    GetBalance = ()=>{
        GetAPI('users/list_balance/crypto/ALL').then(response=>{
            this.setState({
                balance: {
                    'Bitcoin': response.result.btc_balance, 
                    'Ethereum': response.result.eth_balance, 
                    'Litecoin': response.result.ltc_balance
                }
            })
            return null
        }).catch(()=>this.props.history.push('/dashboard'))
    }
    ScrollLoad = (event)=>{
        event.currentTarget.addEventListener('scroll', Debounce(this.Scroll, 500))
    }
    Scroll = (event)=>{
        let offset = event.target.getBoundingClientRect().left
        let children = event.target.querySelectorAll('div.CryptoCard')
        let array = Array.from(children)
        let index = -1
        for(let i = 0 ; i<array.length ; i ++){
            if(array[i].getBoundingClientRect().left + array[i].offsetWidth - offset > 0){
                index = i
                break
            }
        }
        switch(index){
            case 0:
                this.setState({method: 'Bitcoin'}, this.GetRate)
                break
            case 1:
                this.setState({method: 'Ethereum'}, this.GetRate)
                break
            case 2:
                this.setState({method: 'Litecoin'}, this.GetRate)
                break
            default:
                this.setState({method: 'Bitcoin'}, this.GetRate)
        }
    }
    GetRate = async ()=>{
        let code = walletToCode[this.state.method]
        let rate = await GetOther('https://api.coinbase.com/v2/prices/'+code+'-'+this.currency+'/sell')
        this.setState({
            rate: Number(rate.data.amount)
        })
    }
    Pay = ()=>{
        this.setState({
            payError: false,
            loading: true
        },()=>{
            let body = {
                brand: this.props.location.state.code,
                price: this.props.location.state.price*100,
                currency: this.currency
            }
            // In most case, total will not be 0, and any number < 0.01 will be considered 0
            body.crypto = this.props.location.state.total > 0.01 ? walletToCode[this.state.method] : 'CREDIT'
            if(this.props.location.state.apply)
                body.discount_code = this.props.location.state.promo
            POSTAPI('merchant/purchase', body).then(response=>{
                let info = {
                    id: response.txn_id,
                    brandcode: this.props.location.state.code,
                    brandname: this.props.location.state.name,
                    amount: this.props.location.state.price,
                    currency: this.currency
                }
                if(response.link)
                    info.link = response.link
                if(response.code)
                    info.code = response.code
                if(response.pin)
                    info.pin = response.pin
                this.props.history.push({
                    pathname: '/dashboard/result',
                    state: info
                })
                return null
            }).catch(error=>{
                if(error.statusCode === 401)
                    this.props.history.push('/')
                else
                    this.setState({
                        payError: true,
                        errorMessage: error.statusCode === 400 ? 'Insufficient Balance' : 'Please Try Again',
                        loading: false
                    })
            })                       
        })
    }

    componentWillUpdate = (nextProps, nextState) => {
        if(this.state.isScrolling !== nextState.isScrolling ) {
            this.toggleScrolling(nextState.isScrolling)
        }
    }

    toggleScrolling = (isEnable) => {
        if (isEnable) {
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
        } else {
            window.removeEventListener('mousemove', this.onMouseMove);
        }
    }
    
    onMouseMove = (event) => {
        if (this.state.isScrolling) {
            const diff = this.state.initialX  - event.clientX;
            document.getElementsByClassName('CryptoCard-Content')[0].scrollBy(diff, 0);
            this.setState({initialX: event.clientX});
        }
    }
  
    onMouseUp =  () => {
        this.setState({
            isScrolling: false
        })
    }
  
    onDragStart = (event) => {
        event.preventDefault();
        this.setState({
            isScrolling: true,  
            initialX: event.clientX
        });
    }

    onClick = (event) => {
        const cards = [...event.currentTarget.children];
        const idx = cards.findIndex((card) => {
            const rect = card.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right) {
                return true;
            } else {
                return false;
            }
        })
        const methods = ['Bitcoin', 'Ethereum', 'Litecoin'];
        if(idx !== -1) {
            this.setState({method: methods[idx]}, this.GetRate)
        }
    }

    render(){
        if(!this.props.location.state)
            return null
        let Cards = ['Bitcoin', 'Ethereum', 'Litecoin'].map((value, index)=><CryptoCard key={index} type={value} balance={this.state.balance[value]} />)
        let walletCode = walletToCode[this.state.method]
        let price = (this.props.location.state.total / this.state.rate).toFixed(8)
        let errorClass = this.state.payError?"Actived":""
        return  <div id='Checkout'>
                        <div id='Checkout-Background'></div>
                        <p className='Goback' onClick={()=>this.props.history.push('/dashboard')}><i className="fas fa-long-arrow-alt-left"></i> SHOP</p>
                        <p className='Title'>{this.props.location.state.name}</p>
                        <div className='Half-Card'>
                            <GiftCard urlpath={this.props.location.state.code} />
                        </div>
                        <p className='Tooltip-1'>You are converting</p>
                        <p className='Tooltip-2'>${this.props.location.state.total.toFixed(2)}<span>(${this.props.location.state.price} gift card)</span></p>
                        <div 
                            className='CryptoCard-Content' 
                            onLoad={(event)=>this.ScrollLoad(event)}
                            onDragStart={this.onDragStart}
                            onClick={this.onClick}
                            draggable
                        >
                            {Cards}
                        </div>
                        <p className='Rate'>Exchange Rate {walletCode} 1.00 = ${this.state.rate} {this.currency}</p>
                        <p className={'Error '+errorClass}><i className="fas fa-exclamation-circle"></i>{this.state.errorMessage}</p>
                        <button onClick={()=>this.props.history.push('/dashboard')} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                        {
                            this.state.loading
                            ?  <div className='Loading'>
                                    <p>Please wait...</p>
                                    <Loader type='Oval' color="var(--color-white-normal)" height="25" width="25"/>
                                </div>
                            :<button className='button-2' onClick={this.Pay}>confirm {walletCode} {price} <i className="fas fa-arrow-right"></i></button>
                        }
                        
                        <button className='button-1' onClick={()=>this.props.history.push('/dashboard/wallet')}>Deposit<i className="fas fa-arrow-right"></i></button>
                    </div>
    }
}
export default Checkout