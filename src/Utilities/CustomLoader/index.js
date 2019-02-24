import React from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
function CustomLoader(props) {
      return    <div className="CustomLoader">
                      {props.message?<span style={{color: props.color}}>{props.message}</span>:null}
                       <Loader type={props.type} color={props.color} height="25" width="25"/>
                    </div>
}

export default CustomLoader