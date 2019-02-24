import React from 'react'
import './index.css'
import {walletToCode} from '../../../constants'
import CryptoCard from '../CryptoCard'
import CustomLoader from '../../../Utilities/CustomLoader'
import {GetAPI, GetOther, POSTAPI2} from '../../../https'
import { BrowserQRCodeReader } from '@zxing/library'
import LOGO from '../../../Media/Images/Logo.png'

class Withdraw extends React.Component{
    constructor(props){
        super(props)
        this.state={
            balance: 0,
            showContent: false,
            authMessage: null,
            rateCAD: 1,
            rateUSD: 1,
            fee: 0,
            amount: 0,
            legalNotice: 0,                                                      // 0 means nothing, 1 means 1st notice, 2 means 2nd notice, etc. 
            cameraPermissionOpen: false, 
            cameraPermissionBlockOpen: false,
            scanner: null,
            scannerOpen: false,
            loadingOpen: false,      
            success: false         
        }
    }
    componentDidMount(){
        this.walletName = this.props.location.state
        if(!this.props.kycVerified || !this.walletName)
            this.props.history.goBack()
        this.cryptoCurrency = walletToCode[this.walletName]
        this.GetBalance()
        this.timer = setInterval(this.GetRate, 5000)
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }

    GetBalance = ()=>{
        GetAPI('users/list_balance/crypto/'+this.cryptoCurrency).then(response=>{
            this.setState({
                balance: response.result,
                showContent: true
            }, this.GetRate)
            return null
        }).catch(()=>this.props.history.push('/'))
    }

    GetRate = async ()=>{
        let [response1, response2] = await Promise.all([
            GetOther('https://api.coinbase.com/v2/prices/'+this.cryptoCurrency+'-CAD/sell'),
            GetOther('https://api.coinbase.com/v2/prices/'+this.cryptoCurrency+'-USD/sell')
        ])
        this.setState({
            rateCAD: response1.data.amount,
            rateUSD: response2.data.amount
        })
    }

    AmountChange = (event)=>{
        let amount = Number(event.target.value)
        if(!Number.isInteger(amount) && (amount+'').split('.').pop().length > 8){
            event.target.value = this.state.amount
            return
        }
        GetAPI('crypto/get_fee/crypto/'+this.cryptoCurrency+'/amount/'+amount).then(response=>{
           this.setState({
               fee: response
           })
        }).catch(this.props.history.goBack)
        this.setState({
            amount: amount
        })
    }


    ScanPermission = ()=>{
        navigator.permissions.query({name: 'camera'}).then(result=>{
            let state = result.state
            this.setState({
                cameraPermissionOpen: state === 'prompt' ? true : false, 
                cameraPermissionBlockOpen: state === 'denied' ? true : false
            },()=>{
                if(state === 'granted')
                    this.Scan()
            })
        })
    }
    Scan = () =>{
        let codeReader = new BrowserQRCodeReader()
        this.setState({
            cameraPermissionOpen: false,
            cameraPermissionBlockOpen: false,
            scanner: codeReader,
            scannerOpen: true
        },()=>{
            this.state.scanner.decodeFromInputVideoDevice(undefined, 'video').then(result =>{ 
                let data = result.text
                if(data.includes(':'))                                                              // handle edge case from coinbase
                    data = data.split(':').pop()
                document.getElementById('send-address').value = data
                this.CloseScan()
            }).catch(error => alert(error))
        })
    }
    CloseScan = ()=>{
        this.state.scanner.stopStreams()                                                 // this part can be improved ?
        this.setState({
            scanner: null,
            scannerOpen: false
        })
    }
    Send = (event) =>{
        event.preventDefault()
        event.preventDefault()
        let addressEl = event.target['send-address']
        let amountEl = event.target['send-amount']
        if(!addressEl.validity.valid || !amountEl.validity.valid){
            addressEl.classList.add('Checked')
            amountEl.classList.add('Checked')
            this.setState({ authMessage: null })
        }
        else{
            this.setState({
                loadingOpen: true
            },()=>{
                let body = {
                    addr: addressEl.value,
                    crypto: this.cryptoCurrency,
                    amount: amountEl.value
                }
                POSTAPI2('send', body).then(response=>{
                    this.setState({success: true})
                }).catch(error=>{
                    if(error.statusCode === 401)
                        this.props.history.push('/')
                    else if(error.statusCode === 400)
                        this.setState({loadingOpen: false, authMessage: 'Your balance is insuffiecient'})
                    else
                        this.setState({loadingOpen: false, authMessage: 'Please try again'})
                })
            })
        }
    }
    render(){
        if(!this.props.kycVerified)
            return null
        if(!this.state.showContent)
            return  <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-normal)'/>
        if(this.state.success)
            return  <div id='Withdraw-Success'>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Transaction started successfully!</p>
                            <p>You withdraw request is started to be processed. It may take a while, you can check on your side to view current transaction status.</p>
                            <p>For withdraw detail, you can refer to transaction history of your {this.walletName} wallet.</p>
                            <button className='button-1' onClick={()=>this.props.history.push('/dashboard/wallet')}>Back to Wallet<i className="fas fa-arrow-right"></i></button>
                        </div>
        let amountInCAD = (Number(this.state.balance) * Number(this.state.rateCAD)).toFixed(2)
        let amountInUSD = (Number(this.state.balance) * Number(this.state.rateUSD)).toFixed(2)
        let fee = Number(this.state.fee).toFixed(8)
        let total = (Number(this.state.amount) + Number(this.state.fee)).toFixed(8)
        let legalNoticeContent = [
            null,
            <React.Fragment>
                <p className='Title'>Amount to Send</p>
                <p>You can use below button to change currency in display for your convenience to send {this.walletName}.</p>
                <p>Phaze will not charge any fee except the miner fee shown below.</p>
            </React.Fragment>,
            <React.Fragment>
                <p className='Title'>Wallet Address</p>
                <p>Wallet Address is usually the text consists of letters and numbers only. Please double check it before you start withdraw.</p>
                <p>Phaze will not be responsible for any crypto loss due to invalid or wrong wallet address.</p>
            </React.Fragment>
        ]
        return  <div id='Withdraw'>
                        <p className='Goback' onClick={()=>this.props.history.goBack()}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                        <p className='Title'>{this.walletName}</p>
                        <CryptoCard type={this.walletName} balance={this.state.balance}/>
                        <p className='Fiat'>Balance ${amountInCAD}CAD / ${amountInUSD}USD</p>
                        <form noValidate onSubmit={(event)=>this.Send(event)}>
                                <div className='Inline-Input'>
                                    <input id='send-address' name='send-address' type='text' maxLength='50' pattern='^[0-9A-z]+$' placeholder='receive address' required spellCheck="false"></input>
                                    <label htmlFor='send-address'>
                                        <i className="fas fa-location-arrow"></i>
                                    </label>
                                    <i className="question far fa-question-circle" onClick={()=>this.setState({legalNotice: 1})}></i>
                                    <p>letters or numbers required</p>
                                </div>
                                <div className='Inline-Input'>
                                    <input id='send-amount' name='send-amount' type='number' step='0.00000001' placeholder={'amount in '+this.cryptoCurrency} required onChange={(event)=>this.AmountChange(event)}></input>
                                    <label htmlFor='send-amount'>
                                        <i className="fas fa-money-bill"></i>
                                    </label>
                                    <i className="question far fa-question-circle" onClick={()=>this.setState({legalNotice: 2})}></i>
                                    <p>amount is required, minimum is 0.00000001</p>
                                </div>
                                <div className='Calculation'>
                                    <div>
                                        <p>Transaction Fee</p>
                                        <p>{fee} {this.cryptoCurrency}</p>
                                    </div>
                                    <div>
                                        <p>Total</p>
                                        <p>{total} {this.cryptoCurrency}</p>
                                    </div>
                                </div>
                                <button type='button' className='button-2 Photo' onClick={this.ScanPermission}>Scan QR Code<i className="fas fa-camera-retro"></i></button>
                                {this.state.authMessage?
                                    <p className='AuthError'>{this.state.authMessage}</p>
                                    :null
                                }
                                <button type='button' onClick={()=>this.props.history.goBack()} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>          
                                <button type='submit' className='button-1'>Confirm to Send<i className="fas fa-arrow-right"></i></button>
                            </form>
                            {
                                this.state.legalNotice === 0 ? null:
                                <div id='Withdraw-Legal'>
                                    <div className='Main'>
                                        {legalNoticeContent[this.state.legalNotice]}
                                        <p><span onClick={()=>this.setState({legalNotice: 0})}>OK</span></p>
                                    </div>
                                </div>
                            }
                            {
                                this.state.cameraPermissionOpen ?
                                <div id='Camera-Permission'>
                                    <i className="fas fa-times" onClick={()=>this.setState({cameraPermissionOpen: false})}></i>
                                    <div>
                                        <i className="fas fa-camera-retro"></i>
                                        <p className='Title'>Camera Permission</p>
                                        <p>In order to enable scan functionality, please grant Phaze permission to access to your camera.</p>
                                        <button className='button-1' onClick={this.Scan}>Grant<i className="fas fa-long-arrow-alt-left"></i></button> 
                                        <button className='button-2' onClick={()=>this.setState({cameraPermissionOpen: false})}><i className="fas fa-long-arrow-alt-right"></i>Deny</button>          
                                    </div>
                                </div>
                                :null
                            }
                            {
                                this.state.cameraPermissionBlockOpen?
                                <div id='Camera-Block'>
                                    <div className='Main'>
                                        <p className='Title'>Camera is Blocked</p>
                                        <p>You previously blocked Phaze to access to your camera, so scan functionality is disabled.</p>
                                        <p>You can manully change your browser setting to grant Phaze permission. For detail process, please refer to your broswer's support page.</p>
                                        <p><span onClick={()=>this.setState({cameraPermissionBlockOpen: false})}>OK</span></p>
                                    </div>
                                </div>
                                :null
                            }
                            {
                                this.state.scannerOpen?
                                <div id='QRScanner'>
                                    <i className="fas fa-times" onClick={this.CloseScan}></i>
                                    <video id='video'></video>
                                </div>
                                :null
                            }
                            {
                                this.state.loadingOpen?
                                <div id='Withdraw-Loading'>
                                    <CustomLoader type='Oval' message={null} color='var(--color-blue-normal)'/>
                                </div>
                                :null
                            }
                    </div>
    }
}

export default Withdraw