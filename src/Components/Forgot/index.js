import React from 'react'
import './index.css'
import LOGO from '../../Media/Images/Logo.png'
import {POSTAPI} from '../../https'
import Picture from '../../Media/Images/Credential/forgot.png'

class Forgot extends React.Component{
    constructor(props){
        super(props)
        this.state={
            authMessage: null,
            sent: false,
            success: false,
        }
        this.code = this.props.match.params.code
    }
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    SendEmail = (event)=>{
        event.preventDefault()
        let emailEl = event.target['forgot-email']
        if(!emailEl.validity.valid){
            emailEl.classList.add('Checked')
            this.setState({ authMessage: null })
        }
        else{
            let body = {
                email: emailEl.value,
            }
            POSTAPI('public/reset_password', body).then(()=>{
                this.setState({ sent: true })
            }).catch(error=>this.setState({authMessage: error.statusCode === 400?'User Does Not Exist':'Please Try Again'}))
        }
    }
    ChangePassword = (event)=>{
        event.preventDefault()
        let passEl = event.target['forgot-password']
        let passConfrimEl = event.target['forgot-password-confirm']
        if(!passEl.validity.valid || !passConfrimEl.validity.valid){
            passEl.classList.add('Checked')
            passConfrimEl.classList.add('Checked')
            this.setState({ authMessage: null })
        }
        else{
            let body = {
                token: this.code,
                password: passEl.value
            }
            POSTAPI('public/reset_password_verify', body).then(()=>{
                this.setState({ success: true })
            }).catch(error=>this.setState({authMessage: error.statusCode === 400?'Code Invalid or Expired':'Please Try Again'}))
        }
    }
    render(){
        let main = null
        if(!this.code&&!this.state.sent)
            main = <React.Fragment>
                            <p className='Goback' onClick={()=>this.props.history.push('/login')}><i className="fas fa-long-arrow-alt-left"></i></p>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Password assistance</p>
                            <p className='Description'>Just need to confirm your email to send you instructions to reset your password.</p>
                            <form noValidate onSubmit={(event)=>this.SendEmail(event)}>
                                <div className='Inline-Input'>
                                    <input id='forgot-email' name='forgot-email' type='email' maxLength='40' placeholder='e-mail' required spellCheck="false"></input>
                                    <label htmlFor='forgot-email'>
                                        <i className="far fa-envelope"></i>
                                    </label>
                                    <p>Email should be valid</p>
                                </div>
                                {this.state.authMessage?
                                    <p className='AuthError'>{this.state.authMessage}</p>
                                :null
                                }
                                <button type='submit' className='button-1'>Send Email<i className="fas fa-arrow-right"></i></button>
                            </form>
                        </React.Fragment>
        if(!this.code&&this.state.sent)
            main = <React.Fragment>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Success!</p>
                            <p className='Description'>Please check your mailbox for the password reset link.</p>
                            <button type='submit' className='button-1' onClick={()=>this.props.history.push('/login')}>Go to Login<i className="fas fa-arrow-right"></i></button>
                        </React.Fragment>
        if(this.code&&!this.state.success)
            main = <React.Fragment>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Create new password</p>
                            <form noValidate onSubmit={(event)=>this.ChangePassword(event)}>
                                <div className='Inline-Input'>
                                    <input id='forgot-password' name='forgot-password' type='password' maxLength='24' pattern='^[0-9A-z]{8,}$'
                                        placeholder='new password' required onChange={(event)=>document.getElementById('forgot-password-confirm').pattern=event.target.value}></input>
                                    <label htmlFor='forgot-password'>
                                        <i className="fas fa-key"></i>
                                    </label>
                                    <p>Password should be 8~24 letters or numbers</p>
                                </div>
                                <div className='Inline-Input'>
                                    <input id='forgot-password-confirm' name='forgot-password-confirm' type='password' maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='repeat new password' required></input>
                                    <label htmlFor='forgot-password-confirm'>
                                        <i className="fas fa-key"></i>
                                    </label>
                                    <p>Both passwords should be identical</p>
                                </div>
                                {this.state.authMessage?
                                    <p className='AuthError'>{this.state.authMessage}</p>
                                :null
                                }
                                <button type='submit' className='button-1'>Confirm Password<i className="fas fa-arrow-right"></i></button>
                            </form>
                        </React.Fragment>
        if(this.code&&this.state.success)
            main = <React.Fragment>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Success!</p>
                            <p className='Description'>Awesome - your new password has been created.</p>
                            <button type='submit' className='button-1' onClick={()=>this.props.history.push('/login')}>Go to Login<i className="fas fa-arrow-right"></i></button>
                        </React.Fragment>
        return  <div id='Forgot'>
                        <div id='Forgot-Desktop-Background'>
                            <div className='Left'>
                                <p className='Title'>Buy your cryptocurrency through Phaze</p>
                                <p className='Description'>Phaze gives you a reason to buy cryptocurrency and spend it, simply because you save money by getting up to 25% cashback, which means more rewards then any credit card.</p>
                                <div className='Picture'>
                                    <img src={Picture} alt="" />
                                </div>
                            </div>
                            <div className='Right'>
                            </div>
                        </div>
                        <div id='Forgot-Main'>
                            {main}
                        </div>
                    </div>
    }
}

export default Forgot