import React from 'react'
import './index.css'


class GiftCard extends React.Component{
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
        import('../../../Media/Images/Cards/'+this.props.urlpath+'.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(this.GetPlaceHolder)
    }
    GetPlaceHolder = ()=>{
        console.log('Missing Images:', this.props.urlpath)
        /*
        import('../../../Media/Images/Cards/blank.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(()=>{})
        */
    }
    render(){
        return  <img data-value={this.props.urlpath} className='GiftCard-Simple' src={this.state.url} alt="" />
    }
}

export default GiftCard
