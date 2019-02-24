import React from 'react'
import './index.css'
import LOGO from '../../../Media/Images/Logo.png'
import {GetAPI, GetOther} from '../../../https'
import {countryToCode, codeToCurrency} from '../../../constants'
import CryptoCard from '../CryptoCard'

class Wallet extends React.Component{
    constructor(props){
        super(props)
        this.state={
            BTCbalance: 0,
            BCHbalance: 0,
            ETHbalance: 0,
            LTCbalance: 0,
            BTCrate: 1,
            BCHrate: 1,
            ETHrate: 1,
            LTCrate: 1,
            selected: null,
            inactivedMsgOpen: false
        }
    }
    componentDidMount(){
        if(!this.props.kycVerified)
            return
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
        this.fiatCurrency = codeToCurrency[countryToCode[this.props.kycCountry]]
        GetAPI('users/list_balance/crypto/ALL').then(response=>{
            this.setState({
                BTCbalance: response.result.btc_balance,
                BCHbalance: response.result.bch_balance,
                ETHbalance: response.result.eth_balance,
                LTCbalance: response.result.ltc_balance
            }, this.GetRate)
            return null
        }).catch(()=>this.props.history.push('/'))
    }
    GetRate = async () =>{
        let [response1, response2, response3, response4] = await Promise.all([
            GetOther('https://api.coinbase.com/v2/prices/BTC-'+this.fiatCurrency+'/sell'),
            GetOther('https://api.coinbase.com/v2/prices/BCH-'+this.fiatCurrency+'/sell'),
            GetOther('https://api.coinbase.com/v2/prices/ETH-'+this.fiatCurrency+'/sell'),
            GetOther('https://api.coinbase.com/v2/prices/LTC-'+this.fiatCurrency+'/sell')
        ])
        this.setState({
            BTCrate: Number(response1.data.amount),
            BCHrate: Number(response2.data.amount),
            ETHrate: Number(response3.data.amount),
            LTCrate: Number(response4.data.amount),
        })
    }
    SelectWallet = (event)=>{
        let element = event.target.closest('div.Half-Card')
        if(!element)
            return
        let wallet = element.dataset.value
        if( wallet === 'BitcoinCash' ){
            this.setState({
                inactivedMsgOpen: true
            })
        }
        else
            this.props.history.push({
                pathname: '/dashboard/walletdetail',
                state: element.dataset.value
            })
    }
    
    render(){
        if(!this.props.kycVerified)                                                                             // block from the very beginning
            return  <div id='Wallet'>
                            <div className='Error'>
                                <p className='Goback' onClick={()=>this.props.history.goBack()}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                                <img src={LOGO} alt="" />
                                <p className='Title'>Verification Required</p>
                                <p>Visit your account to verify your identity and to activate your wallet.</p>
                                <button type='button' onClick={()=>this.props.history.goBack()} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                <button className='button-1' onClick={()=>this.props.history.push('/dashboard/account')}>Go to Account<i className="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
        return  <div id='Wallet'>
                        <p className='Title'>Crypto Wallets</p>
                        <div id='Wallet-Content' onClick={(event)=>this.SelectWallet(event)}>
                            <div className='Half-Card' data-value='Bitcoin'>
                                <CryptoCard type='Bitcoin' />
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>BTC {this.state.BTCbalance}</span>
                            </p>
                            <p className='Balance-Fiat'>
                                ${(this.state.BTCrate * Number(this.state.BTCbalance)).toFixed(2)} {this.fiatCurrency}
                            </p>
                            <div className='Half-Card' data-value='Ethereum'>
                                <CryptoCard type='Ethereum' />
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>ETH {this.state.ETHbalance}</span>
                            </p>
                            <p className='Balance-Fiat'>
                                ${(this.state.ETHrate * Number(this.state.ETHbalance)).toFixed(2)} {this.fiatCurrency}
                            </p>
                            <div className='Half-Card' data-value='Litecoin'>
                                <CryptoCard type='Litecoin' />
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>LTC {this.state.LTCbalance}</span>
                            </p>
                            <p className='Balance-Fiat'>
                                ${(this.state.LTCrate * Number(this.state.LTCbalance)).toFixed(2)} {this.fiatCurrency}
                            </p>
                            <div className='Half-Card' data-value='BitcoinCash'>
                                <CryptoCard type='BitcoinCash'/>
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>BCH {this.state.BCHbalance}</span>
                            </p>
                            <p className='Balance-Fiat'>
                                ${(this.state.BCHrate * Number(this.state.BCHbalance)).toFixed(2)} {this.fiatCurrency}
                            </p>
                        </div>
                        {this.state.inactivedMsgOpen?
                            <div className='InactiveBox'>
                                <div className='Main'>
                                    <p>BitcoinCash Notice</p>
                                    <p>We have temporarily stopped supporting BCH due to the recent BCH hard fork. BCH will be supported again in the near future. We appreciate your patience!</p>
                                    <p><span onClick={()=>this.setState({inactivedMsgOpen: false})}>OK</span></p>
                                </div>
                            </div>
                            : null
                        }
                    </div>
    }
}

export default Wallet