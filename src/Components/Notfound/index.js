import React from 'react'
import './index.css'
import LOGO from '../../Media/Images/Logo.png'
import MobilePicture from '../../Media/Images/Notfound/mobile.png'
import DesktopPicture from '../../Media/Images/Notfound/desktop.png'

class Notfound extends React.Component{
    render(){
        return  <div id='Notfound'>
                        <img className='Mobile' src={MobilePicture} alt=""/>
                        <img className='Desktop' src={DesktopPicture} alt=""/>
                        <div id='Notfound-Main'>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Not Found</p>
                            <p className='Description'>
                                Your requested resource is not found.
                                <br />
                                Please check your url or contact us if you faced a problem.
                            </p>
                            <button className='button-1' onClick={()=>this.props.history.push('/dashboard')}>
                                go to Phaze<i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
    }
}

export default Notfound