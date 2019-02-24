import React from 'react'
import './index.css'
import CustomLoader from '../../../Utilities/CustomLoader'
import CryptoCard from '../CryptoCard'
import {walletToCode} from '../../../constants'
import {GetAPI, GetAPI2} from '../../../https'
import QRCode from 'qrcode'

class Deposit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            showContent: false,
            showCanvas: false,
            balance: 0,
            address: null,
            copy: false
        }
    }
    componentDidMount(){
        this.walletName = this.props.location.state
        if(!this.props.kycVerified || !this.walletName)
            this.props.history.goBack()
        this.cryptoCurrency = walletToCode[this.walletName]
        this.GetBalance()
    }
    GetBalance = ()=>{
        GetAPI('users/list_balance/crypto/'+this.cryptoCurrency).then(response=>{
            this.setState({
                balance: response.result
            }, this.GetAddress)
            return null
        }).catch(()=>this.props.history.push('/'))
    }
    GetAddress = ()=>{
        GetAPI2('get_address/crypto/'+this.cryptoCurrency).then(response=>{
            // Do not show QR Code canvas if the response is not the address
            if((response === 'Request to create an address was sent, please check back in 10 minutes') || 
               (response === 'Address is being generated, please check again later')) {
                this.setState({
                    address: response,
                    showContent: true,
                    showCanvas: false
                });
                return;
            }
            this.setState({
                address: response,
                showContent: true,
                showCanvas: true
            },()=>{
                let option = {errorCorrectionLevel: 'H'}
                QRCode.toCanvas(document.querySelector('#Deposit-Address>canvas'), this.state.address, option, (error)=>{
                    if(error)   console.log(error)
                })
            })
        }).catch(()=>this.props.history.push('/'))
    }
    Copy = ()=>{
        try{
            let tempElement = document.createElement('textarea')
            tempElement.value = this.state.address
            tempElement.setAttribute('readonly', '')
            tempElement.style.position = 'absolute'
            tempElement.style.left = '-9999px'
            document.body.appendChild(tempElement)
            tempElement.select()
            document.execCommand('copy')
            document.body.removeChild(tempElement)
            this.setState({
                copy: true
            })
        }catch(error){
            console.log(error)
        }
    }
    render(){
        if(!this.props.kycVerified)
            return null
        if(!this.state.showContent)
            return  <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-normal)'/>
        if(!this.state.showCanvas) 
            return  <div id='Deposit'>
                        <p className='Goback' onClick={()=>this.props.history.goBack()}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                        <p className='Title'>{this.walletName}</p>
                        <CryptoCard type={this.walletName} balance={this.state.balance}/>
                        <div id='Deposit-Address'>
                            <canvas></canvas>
                            <p>{this.state.address}</p>
                        </div>
                        <button onClick={()=>this.props.history.goBack()} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>          
                    </div>

        return  <div id='Deposit'>
                        <p className='Goback' onClick={()=>this.props.history.goBack()}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                        <p className='Title'>{this.walletName}</p>
                        <CryptoCard type={this.walletName} balance={this.state.balance}/>
                        <div id='Deposit-Address'>
                            <canvas></canvas>
                            <p>{this.state.address}</p>
                        </div>
                        <button onClick={()=>this.props.history.goBack()} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>          
                        {!this.state.copy?
                            <button className='button-2' onClick={this.Copy}>Copy the Address<i className="far fa-clone"></i></button>
                            :
                            <button className='button-2'>Copied<i className="fas fa-check"></i></button>
                        }
                    </div>
    }
}

export default Deposit
