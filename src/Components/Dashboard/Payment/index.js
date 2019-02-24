import React from 'react'
import './index.css'
import GiftCard from '../GiftCard'
import LOGO from '../../../Media/Images/Logo.png'
import {countryToCode, codeToCurrency} from "../../../constants"
import Debounce from '../../../Utilities/Debounce'

class Payment extends React.Component{
    constructor(props){
        super(props)
        this.state={
            type: null,
            price: 0,
            apply: false,
            openNote: false,
            priceError: false,
            isScrolling: false,
            initialX: 0
        }
    }
    componentDidMount(){
        if(!this.props.brandInfo){
            this.props.history.push('/dashboard')
            return
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
        this.setState({
            type:  this.props.brandInfo.array?0:1,                        // 0 means fixed denomination, 1 means arbitrary range
            price: this.props.brandInfo.array?this.props.brandInfo.array[0]:''
        })
    }
    ScrollLoad = (event)=>{
        event.currentTarget.addEventListener('scroll', Debounce(this.Scroll, 500))
    }
    Scroll = (event)=>{
        let offset = event.target.getBoundingClientRect().left
        let children = event.target.querySelectorAll('img')
        let array = Array.from(children)
        let index = -1
        for(let i = 0 ; i<array.length ; i ++){
            if(array[i].getBoundingClientRect().left + array[i].offsetWidth - offset > 0){
                index = i
                break
            }
        }
        if(index !== -1) {
            this.setState({
                price: this.props.brandInfo.array[index]
            })
        }
    }
    InputChange = (event)=>{
        let value = event.target.value
        if(/^[0-9]+$/.test(value) || value === ''){
            let min = this.props.brandInfo.min
            let max = this.props.brandInfo.max
            this.setState({
                price: value,
                priceError: (Number(value) > max) || (Number(value) < min)
            })
        }
    }
    Confirm = ()=>{
        if(this.state.priceError || this.state.price === '' || this.state.price === 0)
            return
        let price = Number(this.state.price)
        let total = price * 1.02
        let discount = this.state.apply?Math.min(this.props.promoInfo.amount, total*this.props.promoInfo.rate):0
        let result = {
            name: this.props.brandInfo.name,
            code: this.props.brandInfo.code,
            country: this.props.brandInfo.country,
            price : price,
            apply : this.state.apply,
            promo: this.props.promoInfo.code,
            total: Number((total - discount).toFixed(2))
        }
        this.props.history.push({
            pathname: '/dashboard/checkout',
            state: result
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
            document.getElementsByClassName('Denomination-Content')[0].scrollBy(diff, 0);
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
        if(idx !== -1) {
            this.setState({
                price: this.props.brandInfo.array[idx]
            })
        }
    }

    render(){
        if(!this.props.brandInfo)
            return null
        let price = Number(this.state.price)
        let total = price*1.02
        let discount = total*this.props.promoInfo.rate                          // Note the rate has maximum of 1, which means discount <= total
        // The following is considering all available credit user currently has
        let creditBalance = this.props.promoInfo.amount
        discount = Math.min(creditBalance, discount)                        // Still discount <= total
        if(this.state.apply)
            total = total - discount                                                         // In this case, total >= 0 (won't be negative)
        let currency = codeToCurrency[countryToCode[this.props.brandInfo.country]]
        let content = null
        let amount = null
        if(this.state.type===0){
            let items = this.props.brandInfo.array.map((item, index)=><GiftCard key={index} urlpath={this.props.brandInfo.code}/>)
            content = <div 
                            className='Denomination-Content'
                            onLoad={(event)=>this.ScrollLoad(event)} 
                            onDragStart={this.onDragStart}
                            onClick={this.onClick}
                      >
                            {items}
                      </div>
            amount =  <span>${price.toFixed(2)}</span>
        }
        else{
            content = <div className='Range-Content'>
                                <GiftCard urlpath={this.props.brandInfo.code}/>
                            </div>
            let placeholder = this.props.brandInfo.min+'~'+this.props.brandInfo.max
            amount = <div className='Range-Input'>
                                $
                                <input className={this.state.priceError?"Error":""} type='text' onChange={(event)=>this.InputChange(event)} value={this.state.price} placeholder={placeholder}/>
                                .00 {this.state.priceError?<p className='Error'>{'only '+placeholder+' is allowed'}</p>:null}
                            </div>
        }
        let applyButton = <button className='Disabled'>Unavailable</button>
        if(this.props.promoInfo.amount !==0 && this.props.promoInfo.code){
            if(this.state.apply)
                applyButton = <button className='Apply'><i className="fas fa-check"></i>Applied</button>
            else
                applyButton = <button onClick={()=>this.setState({apply: true})}><i className="fas fa-long-arrow-alt-left"></i>Apply</button>
        }
        return  <div id='Payment'>
                        <div id='Payment-Background'></div>
                        <p className='Goback' onClick={()=>this.props.history.push('/dashboard')}><i className="fas fa-long-arrow-alt-left"></i> SHOP</p>
                        <p className='Title'>{this.props.brandInfo.name}</p>
                        {content}
                        <div className='DetailPanel'>
                            <div>
                                <i className="fas fa-money-bill"></i>
                                <span></span>
                                {amount}
                            </div>
                            <div>
                                <i className="fas fa-hand-holding-usd"></i>
                                <span>(+)</span>
                                <span>${(price*0.02).toFixed(2)}</span>
                            </div>
                            <div className={this.state.apply?"Apply":""}>
                                <i><img src={LOGO} alt="" /></i>
                                <span>(-)</span>
                                <span><i className="fas fa-exclamation-circle" onClick={()=>this.setState({openNote: true})}></i>${discount.toFixed(2)}</span>
                                {applyButton}   
                            </div>
                        </div>
                        <div className='Total'>
                            <span>Total</span>
                            <span>${total.toFixed(2)} <small>{currency}</small></span>
                        </div>
                        <button type='button' onClick={()=>this.props.history.push('/dashboard')} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                        <button className='button-2 Confirm' onClick={this.Confirm}>Confirm<i className="fas fa-arrow-right"></i></button>
                        {this.state.openNote?
                            <div id='Payment-CreditNote'>
                                <i className="fas fa-times" onClick={()=>this.setState({openNote: false})}></i>
                                <p className='Title'>Phaze Credit Guidelines</p>
                                <p>Thank you for using Phaze for your daily expenses. You currently have <span>{this.props.promoInfo.amount}</span>. Each credit can be redeemed as <span>$1</span> depending on the retailer country of operation.</p>
                                <p>When you choose to apply credit for the current purchase, simply click the Apply button on the right.</p>
                                <p>The amount you apply will be automatically calculated. It will be either <span>{(this.props.promoInfo.rate*100).toFixed(2)}%</span> of your total bill or your entire current credit balance, depending on which number is smaller.</p>
                            </div>
                            :null
                        }
                    </div>
    }
}

export default Payment


