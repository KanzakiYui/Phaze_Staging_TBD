import React from 'react'
import './index.css'
import LOGO from '../../Media/Images/Logo.png'
import {POSTAPI} from '../../https'
import Picture from '../../Media/Images/Credential/signup.png'

class Signup extends React.Component{
    constructor(props){
        super(props)
        this.state={
            success: false,
            authMessage: null
        }
    }
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    OpenTerms = ()=>{
        import('../../Media/Files/Terms.pdf').then(file=>window.open(file.default, '_blank'))
    }
    CreateAccount = (event)=>{
        event.preventDefault()
        let emailEl = event.target['signup-email']
        let passEl = event.target['signup-password']
        let passConfrimEl = event.target['signup-password-confirm']
        let promoEl = event.target['signup-promo']
        let checkEl = event.target['signup-check']
        if(!emailEl.validity.valid || !passEl.validity.valid || !passConfrimEl.validity.valid || !promoEl.validity.valid || !checkEl.checked){
            emailEl.classList.add('Checked')
            passEl.classList.add('Checked')
            passConfrimEl.classList.add('Checked')
            promoEl.classList.add('Checked')
            checkEl.classList.add('Checked')
            this.setState({ authMessage: null })
        }
        else{
            let body={
                username: emailEl.value,
                password: passEl.value,
                promo: promoEl.value
            }
            POSTAPI('public/signup', body).then(()=>{
                this.setState({
                    success: true,
                    authMessage: null
                })
            }).catch(error=>{
                let message = 'Please Try Again'
                if(error.statusCode === 403)
                    message = 'This promo code is expired or invalid'
                else if(error.statusCode === 400)
                    message = 'The email has been used already'
                this.setState({ authMessage: message })
            })
        }
    }
    render(){
        let main = null
        if(!this.state.success)
            main = <React.Fragment>
                            <p className='Goback' onClick={()=>this.props.history.push('/login')}><i className="fas fa-long-arrow-alt-left"></i></p>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Create your account</p>
                            <form noValidate onSubmit={(event)=>this.CreateAccount(event)}>
                                <div className='Inline-Input'>
                                    <input id='signup-email' name='signup-email' type='email' maxLength='40' placeholder='e-mail' required spellCheck="false"></input>
                                    <label htmlFor='signup-email'>
                                        <i className="far fa-envelope"></i>
                                    </label>
                                    <p>Email should be valid</p>
                                </div>
                                <div className='Inline-Input'>
                                    <input id='signup-password' name='signup-password' type='password' maxLength='24' pattern='^[0-9A-z]{8,}$'
                                        placeholder='password' required onChange={(event)=>document.getElementById('signup-password-confirm').pattern=event.target.value}></input>
                                    <label htmlFor='signup-password'>
                                        <i className="fas fa-key"></i>
                                    </label>
                                    <p>Password should be 8~24 letters or numbers</p>
                                </div>
                                <div className='Inline-Input'>
                                    <input id='signup-password-confirm' name='signup-password-confirm' type='password' maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='repeat your password' required></input>
                                    <label htmlFor='signup-password-confirm'>
                                        <i className="fas fa-key"></i>
                                    </label>
                                    <p>Both passwords should be identical</p>
                                </div>
                                <div className='Inline-Input'>
                                    <input id='signup-promo' name='signup-promo' type='text' maxLength='24' placeholder='promo code' spellCheck="false" required defaultValue={this.props.match.params.code}></input>
                                    <label htmlFor='signup-promo'>
                                        <i className="fas fa-gift"></i>
                                    </label>
                                    <p>Promo code is required</p>
                                </div>
                                <div className="CheckCondition">
                                    <input id="signup-check" name='signup-check' type="checkbox" />
                                    <label htmlFor="signup-check">
                                        <span></span>
                                    </label>
                                    <span>I accept the <i onClick={this.OpenTerms}>Terms & Conditions</i></span>
                                    <p>Please accept the terms and conditions.</p>
                                </div>
                                {this.state.authMessage?
                                    <p className='AuthError'>{this.state.authMessage}</p>
                                :null
                                }
                                <button type='submit' className='button-1'>Sign Up<i className="fas fa-arrow-right"></i></button>
                            </form>
                        </React.Fragment>
        else
            main = <React.Fragment>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Success!</p>
                            <p className='Description'>Great! Your account has been created.</p>
                            <button className='button-1' onClick={()=>this.props.history.push('/login')}>Go to Login<i className="fas fa-arrow-right"></i></button>  
                        </React.Fragment>
        return  <div id='Signup'>
                        <div id='Signup-Desktop-Background'>
                            <div className='Left'>
                                <p className='Title'>Recieve Fiat Digital Gift Cards</p>
                                <p className='Description'>We provide an alternative to doing crypto to fiat conversions through your bank. With Phaze, instantly recieve fiat digital gift cards and spend your cryptocurrency.</p>
                                <div className='Picture'>
                                    <img src={Picture} alt="" />
                                </div>
                            </div>
                            <div className='Right'>
                            </div>
                        </div>
                        <div id='Signup-Main'>
                           {main}
                        </div>
                    </div>
    }
}

export default Signup