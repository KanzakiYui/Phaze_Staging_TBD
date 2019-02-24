import React from 'react'
import './index.css'


class GiftLogo extends React.Component{
    constructor(props){
        super(props)
        this.state={
            urlpath: null,
            url: null
        }
    }
    componentDidMount(){
        this.GetURL()
    }
    componentDidUpdate(){
        if(this.props.urlpath!==this.state.urlpath)
            this.GetURL()
    }
    GetURL = ()=>{
        import('../../../Media/Images/Logos/'+this.props.urlpath+'.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(this.GetPlaceHolder)
    }
    GetPlaceHolder = ()=>{
        console.log('Missing Logo:', this.props.urlpath)
        /*
        import('../../../Media/Images/Logos/blank.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(()=>{})
        */
    }
    render(){
        switch(this.props.type){
            case 0:
                return <img src={this.state.url} alt="" />
            default:
                return  <div data-value={this.props.urlpath} className='GiftLogo-Simple'>
                                <img src={this.state.url} alt="" />
                            </div>
        }
        
    }
}

export default GiftLogo
