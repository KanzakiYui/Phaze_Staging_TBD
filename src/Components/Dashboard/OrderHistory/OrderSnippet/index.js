import React from 'react'
import './index.css'
import GiftLogo from '../../GiftLogo'
import {DateShow, TimeShow} from '../../../../Utilities/Time'
import AutofillLink from '../../../../Utilities/Autofill'

class OrderSnippet extends React.Component{
    constructor(props){
        super(props)
        this.state={
            expand: false,
        }
    }
    rednerLink() {
        if(this.props.info.link === 'ERROR') {
            return <div className='ERROR'>ERROR</div>
        } 
        if(this.props.info.link) {
            return <div className='Link'><a className='Link' href={this.props.info.link} target="_blank" rel="noopener noreferrer">VIEW GIFT CARD</a></div>
        }
        return null
    }
    render(){
        let currency = this.props.info.currency
        let price = Number(this.props.info.price)/100
        let fee = Number(this.props.info.fee)/100
        let total = Number(this.props.info.price_charged)/100
        let credit = price + fee - total
        let rate = total / Number(this.props.info.price_crypto)
        let detailType = this.props.info.link?'Link':'NoLink'
        let autofillLink = null
        if(this.props.info.code)
            autofillLink = AutofillLink(this.props.info.brand, this.props.info.code, this.props.info.pin)
        return <div className='OrderSnippet'>
                    <div className='GeneralInfo' onClick={()=>this.setState({expand: !this.state.expand})}>
                        <GiftLogo type={0} urlpath = {this.props.info.brand} />
                        <div>
                            <p>${price.toFixed(2)}</p>
                            <p>{DateShow(new Date(this.props.info.time).toLocaleDateString('en-ca'))}</p>
                        </div>
                        <i className="fas fa-angle-down"></i>
                    </div>
                    <div className={'DetailInfo '+(this.state.expand?"Active":"")+' '+detailType}>
                        <p className='Line First'></p>
                        <p className='Time'>{TimeShow(new Date(this.props.info.time).toLocaleTimeString('en-ca'))}</p>
                        <div className='Inline-Amount'>
                            <p>Fee(2%)</p>
                            <p>${fee.toFixed(2)} <span>{currency}</span></p>
                        </div>
                        <div className='Inline-Amount'>
                            <p>Applied Credit</p>
                            <p>${credit.toFixed(2)} <span>{currency}</span></p>
                        </div>
                        <div className='Inline-Amount'>
                            <p>Promo Code</p>
                            <p className='Promo'>{this.props.info.promo_code?this.props.info.promo_code:<span>UNAVAILABLE</span>}</p>
                        </div>
                        <p className='SubLine'></p>
                        <div className='Inline-Amount'>
                            <p>Total</p>
                            <p>${total.toFixed(2)} <span>{currency}</span></p>
                        </div>
                        <div className='Inline-Amount'>
                            <p></p>
                            <p>{this.props.info.price_crypto} <span>{this.props.info.crypto}</span></p>
                        </div>
                        <p className='Rate'>Exchange rate {this.props.info.crypto} 1.00 = ${rate.toFixed(2)} {currency}</p>
                        <p className='Line'></p>
                        <br/>
                        {this.rednerLink()}
                        {
                            this.props.info.code?
                            <div className='Inline-Amount'>
                                <p>Gift card code</p>
                                <p>{this.props.info.code}</p>
                            </div>:null
                        }
                        {
                            this.props.info.pin?
                            <div className='Inline-Amount'>
                                <p>Gift card pin</p>
                                <p>{this.props.info.pin}</p>
                            </div>:null
                        }
                        {
                            ((this.props.info.code || this.props.info.pin) && autofillLink) ?
                            <a className='Link' href={autofillLink} target="_blank" rel="noopener noreferrer">Use Gift Card</a>:null
                        }
                    </div>
                  </div>
    }
}

export default OrderSnippet
