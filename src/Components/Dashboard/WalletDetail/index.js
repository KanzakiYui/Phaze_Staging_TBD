import React from 'react'
import './index.css'
import CryptoCard from '../CryptoCard'
import {GetAPI, GetOther} from '../../../https'
import {walletToCode, countryToCode, codeToCurrency} from '../../../constants'
import WalletTransactionSnippt from './WalletTransactionSnippt'

class WalletDetail extends React.Component{
    constructor(props){
        super(props)
        this.walletName = this.props.location.state
        this.kycVerified = this.props.kycVerified
        this.maxRecordsPerPage = 6
        this.maxIndicators = 5
        this.state={
            showContent: false,
            balance: 0,
            rate: 1,
            transactions: [],
            pageIndex: 0,
            totalPage: 1,
            prev: false,
            next: false
        }
    }
    componentDidMount(){
        if(!this.walletName || !this.kycVerified){
            this.props.history.push('/dashboard')
            return
        }
        this.cryptoCurrency = walletToCode[this.walletName]
        this.fiatCurrency = codeToCurrency[countryToCode[this.props.kycCountry]]
        GetAPI('users/list_balance/crypto/'+this.cryptoCurrency).then(response=>{
            this.setState({
                balance: response.result
            }, this.GetRate)
            return null
        }).catch(()=>this.props.history.push('/'))
    }
    GetRate = async ()=>{
        GetOther('https://api.coinbase.com/v2/prices/'+this.cryptoCurrency+'-'+this.fiatCurrency+'/sell').then(response=>{
            this.setState({
                rate: response.data.amount
            }, this.GetHistory)
            return null
        }).catch(()=>{})
    }
    GetHistory = async () =>{
        let [response1, response2] = await Promise.all([
            GetAPI('users/list_txns/brand/ALL/crypto/'+this.cryptoCurrency),
            GetAPI('users/list_txns_crypto/crypto/'+this.cryptoCurrency)
        ])
        let data = response1.result.concat(response2.result)
        data.sort((a, b)=>new Date(b.time).getTime() - new Date(a.time).getTime())
        this.setState({
            showContent: true,
            transactions: data,
            pageIndex: 0,
            totalPage: Math.ceil(data.length/this.maxRecordsPerPage),
            prev: false,
            next: data.length > this.maxRecordsPerPage ? true : false
        })
    }

    Goto = (index)=>{
        this.setState({
            pageIndex: index,
            prev: index === 0 ? false : true,
            next: index === this.state.totalPage - 1 ? false : true
        })
    }

    Deposit = () =>{
        this.props.history.push({
            pathname: '/dashboard/deposit',
            state: this.walletName
        })
    }
    Withdraw = () =>{
        this.props.history.push({
            pathname: '/dashboard/withdraw',
            state: this.walletName
        })
    }
    render(){
        if(!this.walletName || !this.kycVerified || !this.state.showContent)
            return null
        let start = this.state.pageIndex*this.maxRecordsPerPage
        let end = start + this.maxRecordsPerPage
        let items = this.state.transactions.slice(start, end).map((item, index)=><WalletTransactionSnippt key={index} info={item} crypto={this.cryptoCurrency} fiat={this.fiatCurrency} rate={this.state.rate} />)
        let half = Math.floor(this.maxIndicators / 2)
        let startIndicator, endIndicator
        if(this.state.pageIndex - half < 0){
            startIndicator = 0
            endIndicator = Math.min(this.state.totalPage - 1, startIndicator + this.maxIndicators - 1)
        }
        else if(this.state.pageIndex + half > this.state.totalPage - 1){
            startIndicator = Math.max(0, this.state.totalPage - this.maxIndicators)
            endIndicator = this.state.totalPage - 1
        }   
        else{
            startIndicator = this.state.pageIndex - half
            endIndicator  = this.state.pageIndex + half
        }
        let indicators = []
        for (let i = startIndicator; i <= endIndicator; i++)
            indicators.push(<span key={i} className={this.state.pageIndex===i?"Active":""} onClick={()=>this.Goto(i)}>{i + 1}</span>)
        return  <div id='Wallet-Detail'>
                        <p className='Goback' onClick={()=>this.props.history.goBack()}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                        <p className='Title'>{this.walletName}</p>
                        <CryptoCard type={this.walletName} balance={this.state.balance}/>
                        <p className='Rate'>Exchange rate {this.cryptoCurrency} 1.00 = ${this.state.rate} {this.fiatCurrency}</p>
                        <button className='button-2' onClick={this.Withdraw}>Withdraw <i className="fas fa-upload"></i></button>
                        <button onClick={()=>this.props.history.goBack()} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>          
                        <button className='button-1' onClick={this.Deposit}>Deposit <i className="fas fa-download"></i></button>
                        <div id='Wallet-Txn'>
                            <p>Transaction History ({this.state.transactions.length} records)</p>
                            {items}
                            <div className='Pagination'>
                                <p className='Prev'>{this.state.prev?<i className="fas fa-angle-left" onClick={()=>this.Goto(this.state.pageIndex - 1)}></i>:null}</p>
                                {indicators}
                                <p className='Next'>{this.state.next?<i className="fas fa-angle-right" onClick={()=>this.Goto(this.state.pageIndex + 1)}></i>:null}</p>
                            </div>
                        </div>
                    </div>
    }
}

export default WalletDetail