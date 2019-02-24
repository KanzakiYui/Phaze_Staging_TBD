import React from 'react'
import './index.css'
import {DateShow, TimeShow} from '../../../../Utilities/Time'
import DepositIcon from '../../../../Media/Svgs/deposit.svg'
import WithdrawIcon from '../../../../Media/Svgs/withdraw.svg'
import ShoppingIcon from '../../../../Media/Svgs/shppoing.svg'
import AutofillLink from '../../../../Utilities/Autofill'

class WalletTransactionSnippt extends React.Component{
    constructor(props){
        super(props)
        this.state={
            openDetail: false,
            type: 0                                                     // by default
        }
    }
    componentDidMount(){
        this.setState({
            type: this.props.info.status?0:(this.props.info.other_address?1:2)                    // 0 = deposit, 1 = withdraw, 2 = purchase
        })
    }
    componentDidUpdate(){
        let type = this.props.info.status?0:(this.props.info.other_address?1:2)                    // 0 = deposit, 1 = withdraw, 2 = purchase
        if(type !== this.state.type){
            this.setState({
                type: type
            })
        }
            
    }
    render(){
        let date = DateShow(new Date(this.props.info.time).toLocaleDateString('en-ca'))
        let time = TimeShow(new Date(this.props.info.time).toLocaleTimeString('en-ca'))
        let icon = [DepositIcon, WithdrawIcon, ShoppingIcon]
        let actionTitle = ['DEPOSIT', 'WITHDRAW', 'PURCHASE']
        let price = Number(this.props.info.price_crypto)
        if(this.props.info.fee_charged)
            price = price + Number(this.props.info.fee_charged)
        price = (price * Number(this.props.rate)).toFixed(2)
        let purchasePrice = (Number(this.props.info.price_charged)/100).toFixed(2)
        let autofillLink = null
        if(this.props.info.code)
            autofillLink = AutofillLink(this.props.info.brand, this.props.info.code, this.props.info.pin)
        let details = [
            <p>Status<span>{this.props.info.status}</span></p>,
            <p className='Address'>Wallet Address<span>{this.props.info.other_address}</span></p>,
            <React.Fragment>
                {this.props.info.link?<a href={this.props.info.link} target='_blank' rel="noopener noreferrer">View Gift Card</a>:null}
                {this.props.info.code?<p>Gift Card Code<span>{this.props.info.code}</span></p>:null}
                {this.props.info.pin?<p>Gift Card PIN<span>{this.props.info.pin}</span></p>:null}
                {autofillLink?<a href={autofillLink} target='_blank' rel="noopener noreferrer">Apply Gift Card</a>:null}
            </React.Fragment>
        ]
        return  <div className='WalletTransaction'>
                        <img src={icon[this.state.type]} alt="" />
                        <div>
                            <div className='General' onClick={()=>this.setState({openDetail: !this.state.openDetail})}>
                                <div>
                                    <p>{actionTitle[this.state.type]}</p>
                                    <p>{this.props.crypto} {this.props.info.price_crypto}</p>
                                </div>
                                <div>
                                    <p>{date}</p>
                                    <p>${this.state.type!==2?price:purchasePrice} {this.state.type!==2?this.props.fiat:this.props.info.currency}</p>  
                                </div>
                            </div>
                            <div className={'Detail '+(this.state.openDetail?'Active':'')}>
                                <p>{time}</p>
                                <p>Exchange rate {this.props.crypto} 1.00 = ${this.props.rate} {this.props.fiat}</p>
                                {details[this.state.type]}
                            </div>
                        </div>
                    </div>
    }
}

export default WalletTransactionSnippt