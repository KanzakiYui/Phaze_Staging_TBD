import React from 'react'
import './index.css'

class Account extends React.Component{
    
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    
    render(){
        let rate = this.props.promoInfo.rate * 100
        rate = rate.toFixed(2)+"%"
        return  <div id='Account'>
                        <p className='Title'>Profile</p>
                        <div className='General-Info'>
                            <p>Email</p>
                            <p>{this.props.username}</p>
                            <p>Identity</p>
                            <p>{this.props.kycCountry?this.props.kycCountry:'Unverified'}</p>
                            <p>Phaze Promo Code</p>
                            <p>{this.props.promoInfo.code}</p>
                            <p>Applicable Rate</p>
                            <p>{rate}</p>
                        </div>
                        {
                            this.props.kycCountry?null:<button className='button-1' onClick={()=>this.props.history.push('identity')}>Verify Your Identity<i className="fas fa-arrow-right"></i></button>
                        }
                        <button className='button-2' onClick={()=>this.props.history.push('changepassword')}>Change Password<i className="fas fa-arrow-right"></i></button>
                        <button className='button-2' onClick={()=>this.props.history.push('orderhistory')}>View Order History<i className="fas fa-arrow-right"></i></button>
                    </div>
    }
}

export default Account