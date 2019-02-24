import React from 'react'
import './index.css'
import LOGO from '../../../Media/Images/Logo.png'
import {POSTAPI} from '../../../https'

class ChangePassword extends React.Component{
    constructor(props){
        super(props)
        this.state={
            error: null,
            success: false
        }
    }
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    Submit = (event)=>{
        event.preventDefault()
        let oldEl = event.target['passwrodchange-old']
        let passEl = event.target['passwrodchange-password']
        let passConfrimEl = event.target['passwrodchange-confirm']
        this.setState({
            error: null
        },()=>{
            if(!oldEl.validity.valid || !passEl.validity.valid || !passConfrimEl.validity.valid){
                oldEl.classList.add('Checked')
                passEl.classList.add('Checked')
                passConfrimEl.classList.add('Checked')
            }
            else{
                let body ={
                    old_password: oldEl.value,
                    new_password: passEl.value
                }
                POSTAPI('users/change_password', body).then(()=>{
                    this.setState({
                        success: true
                    })
                }).catch(error=>{
                    if(error.statusCode === 401)
                        this.props.push('/')
                    else
                        this.setState({
                            error: error.statusCode === 400?'Current password is incorrect':'Failed to change'
                        })
                })
            }
        })
    }
    render(){
        if(this.state.success)
            return  <div id='ChangePassword'>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Success!</p>
                            <p>Awesome - your password has been updated.</p>
                            <button className='button-1' onClick={()=>this.props.history.push('account')}>Back to Account</button>
                        </div>
        return  <div id='ChangePassword'>
                        <p className='Goback' onClick={()=>this.props.history.push('account')}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                        <img src={LOGO} alt="" />
                        <p className='Title'>Change Password</p>
                        <form noValidate onSubmit={(event)=>this.Submit(event)}>
                            <div className='Inline-Input'>
                                <input id='passwrodchange-old' name='passwrodchange-old' type='password' placeholder='current password' required></input>
                                <label htmlFor='passwrodchange-old'>
                                    <i className="fas fa-key"></i>
                                </label>
                                <p>Enter your current password</p>
                            </div>
                            <div className='Inline-Input'>
                                <input id='passwrodchange-password' name='passwrodchange-password' type='password' maxLength='24' pattern='^[0-9A-z]{8,}$'
                                    placeholder='new password' required onChange={(event)=>document.getElementById('passwrodchange-confirm').pattern=event.target.value}></input>
                                <label htmlFor='passwrodchange-password'>
                                    <i className="fas fa-key"></i>
                                </label>
                                <p>Password should be 8~24 letters or numbers</p>
                            </div>
                            <div className='Inline-Input'>
                                <input id='passwrodchange-confirm' name='passwrodchange-confirm' type='password' maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='repeat new password' required></input>
                                <label htmlFor='passwrodchange-confirm'>
                                    <i className="fas fa-key"></i>
                                </label>
                                <p>Both passwords should be identical</p>
                            </div>
                            {this.state.error?
                                <p className='AuthError'>{this.state.error}</p>
                                :null
                            }
                            <button type='button' onClick={()=>this.props.history.push('account')} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                            <button type='submit' className='button-1'>Save New Password<i className="fas fa-arrow-right"></i></button>
                        </form>
                    </div>
    }
}

export default ChangePassword