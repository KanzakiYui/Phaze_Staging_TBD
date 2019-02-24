import React from 'react'
import './index.css'
import LOGO from '../../../Media/Images/Logo.png'
import {GetAPI} from '../../../https'

class Notverified extends React.Component{
    constructor(props){
        super(props)
        this.state={
            step: 0                                             // 0 means before 1st send, 1 means before 2nd send, 2(3, 4, 5, ...) means before 3rd/4th/5th... send
        }
    }
    Send = async ()=>{
        await GetAPI('users/send_verify_email').catch(this.props.Logout)
        this.setState(prevState=>({step: prevState.step + 1}))
    }
    render(){
        let main = null
        if(this.state.step === 0)
            main = <React.Fragment>
                            <p className='Title'>Active your<br />account</p>
                            <p className='Description'>Click the button below, and check your mailbox for a verification link to active your account.</p>
                            <button className='button-1' onClick={this.Send}>Verify Now<i className="fas fa-arrow-right"></i></button>
                        </React.Fragment>
        else if(this.state.step === 1)
            main = <React.Fragment>
                            <p className='Title'>Success!</p>
                            <p className='Description'>Great - please check your mailbox. We've sent you a verification link.</p>
                            <button className='button-1' onClick={this.Send}>Send Again<i className="fas fa-arrow-right"></i></button>
                        </React.Fragment>
        else
            main = <React.Fragment>
                            <p className='Title'>Success!</p>
                            <p className='Description'>Don't worry - another verification link was sent to your mailbox. It might help to check your mailbox spam folder.</p>
                            <button className='button-1' onClick={this.Send}>Send Again<i className="fas fa-arrow-right"></i></button>
                        </React.Fragment>
        return  <div id='Notverified'>
                        <div id='Notverified-Main'>
                            <img src={LOGO} alt="" />
                            {main}
                            <button className='button-2' onClick={this.props.Logout}>Log Out<i className="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
    }
}

export default Notverified