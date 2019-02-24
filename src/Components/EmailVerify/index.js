import React from 'react'
import './index.css'
import {GetAPI} from '../../https'
import CustomLoader from '../../Utilities/CustomLoader'

class EmailVerify extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            status: 0                                               // 0 = initial, 1 = error, 2 = success
        }
    }
    componentDidMount(){
        let code = this.props.match.params.code
        GetAPI('public/verify_email_token/token/'+code).then(()=>this.setState({status: 2})).catch(()=>this.setState({status: 1}))
    }
    render(){
        switch(this.state.status){
            case 0:
                return <CustomLoader message='please wait...' type='Oval' color='var(--color-red-normal)' />
            case 1:
                return  <div id='EmailVerify'>
                                <p>We couldn't verify your account.</p>
                                <p>This link is either incorrect or no longer valid.</p>
                                <button className='button-1' onClick={()=>this.props.history.push('/')}>Go to Login<i className="fas fa-arrow-right"></i></button>
                            </div>
            case 2:
                return  <div id='EmailVerify'>
                                <p>Your account was successfully verified!</p>
                                <p>Your account is now verified, and you can purchase gift cards.</p>
                                <button className='button-1' onClick={()=>this.props.history.push('/')}>Go to Login<i className="fas fa-arrow-right"></i></button>
                            </div>
            default:
                return null
        }
    }
}

export default EmailVerify