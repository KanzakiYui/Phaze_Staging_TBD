import React from 'react'
import './index.css'
import BitcoinLOGO from '../../../Media/Images/Coins/Bitcoin.png'
import EthereumLOGO from '../../../Media/Images/Coins/Ethereum.png'
import LiteCoinLOGO from '../../../Media/Images/Coins/Litecoin.png'
import BitcoinCashLOGO from '../../../Media/Images/Coins/BitcoinCash.png'
import {walletToCode} from '../../../constants'

class CryptoCard extends React.Component{
    
    render(){
        switch(this.props.type){
            case 'Bitcoin':
                return  <div className= 'CryptoCard Bitcoin'>
                                <div>
                                    <img src={BitcoinLOGO} alt="" />
                                    <p>bitcoin</p>
                                </div>
                                <div>
                                    <p>Your balance:</p>
                                    <p>{walletToCode[this.props.type]} {this.props.balance}</p>
                                </div>
                            </div>
            case 'Ethereum':
                return  <div className= 'CryptoCard Ethereum'>
                                <div>
                                    <img src={EthereumLOGO} alt="" />
                                    <p>ethereum</p>
                                </div>
                                <div>
                                    <p>Your balance:</p>
                                    <p>{walletToCode[this.props.type]} {this.props.balance}</p>
                                </div>
                            </div>
            case 'Litecoin':
                return  <div className= 'CryptoCard Litecoin'>
                                <div>
                                    <img src={LiteCoinLOGO} alt="" />
                                    <p>litecoin</p>
                                </div>
                                <div>
                                    <p>Your balance:</p>
                                    <p>{walletToCode[this.props.type]} {this.props.balance}</p>
                                </div>
                            </div>
            case 'BitcoinCash':
                return  <div className= 'CryptoCard BitcoinCash'>
                                <div>
                                    <img src={BitcoinCashLOGO} alt="" />
                                    <p>Bitcoin<span>Cash</span></p>
                                </div>
                                <div>
                                    <p>Your balance:</p>
                                    <p>{walletToCode[this.props.type]} {this.props.balance}</p>
                                </div>
                            </div>
            default:
                return null
        }
    }
}

export default CryptoCard
