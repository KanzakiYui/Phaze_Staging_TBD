import React from 'react'
import './index.css'
import LOGO from '../../Media/Images/Logo.png'
function Compatibility(){
    return  <div id='Compatibility'>
                    <img src={LOGO} alt="" />
                    <p className='Title'>Unsupported Browser</p>
                    <div className='Content'>
                        <p><i className="fas fa-exclamation-triangle"></i></p>
                        <p className='Description'>We do not support the current browser. We recommend using the latest version of the following browsers;</p>
                        <div className="List">
                            <p><i className="fab fa-safari"> Safari</i><a href="https://www.apple.com/ca/safari/">View</a></p>
                            <p><i className="fab fa-chrome"> Chrome</i><a href="https://www.google.com/chrome/">View</a></p>
                            <p><i className="fab fa-firefox"> Firefox</i><a href="https://www.mozilla.org">View</a></p>
                            <p><i className="fab fa-opera"> Opera</i><a href="https://www.opera.com/">View</a></p> 
                            <button className='button-1' onClick={()=>window.location.href='https://www.phaze.io'}>Go to Phaze.io<i className="fas fa-arrow-right"></i></button> 
                        </div>
                    </div>
               </div>
}

export default Compatibility