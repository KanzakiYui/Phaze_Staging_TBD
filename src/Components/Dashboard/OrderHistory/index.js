import React from 'react'
import './index.css'
import CustomLoader from '../../../Utilities/CustomLoader'
import {GetAPI} from '../../../https'
import OrderSnippet from './OrderSnippet'

class OrderHistory extends React.Component{
    constructor(props){
        super(props)
        this.maxRecordsPerPage = 20
        this.maxIndicators = 5
        this.state={
            showContent: false,
            data: null,
            pageIndex: 0,
            totalPage: 1,
            prev: false,
            next: false
        }
    }
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
        this.FetchAllOrders()
    }
    FetchAllOrders = ()=>{
        GetAPI('users/list_txns/brand/ALL/crypto/ALL').then(response=>{
            let result = response.result.sort((a, b)=>new Date(b.time).getTime() - new Date(a.time).getTime())
            this.setState({
                data: result, 
                showContent: true, 
                pageIndex: 0,
                totalPage: Math.ceil(result.length/this.maxRecordsPerPage),
                prev: false,
                next: result.length > this.maxRecordsPerPage ? true : false
            })
        }).catch(()=>this.props.push('/'))
    }
    Goto = (index)=>{
        this.setState({
            pageIndex: index,
            prev: index === 0 ? false : true,
            next: index === this.state.totalPage - 1 ? false : true
        })
    }
    render(){
        if(!this.state.showContent)
            return  <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-normal)'/>
        if(this.state.data.length === 0)
            return  <div id='OrderHistory'>
                            <p className='Goback' onClick={()=>this.props.history.push('account')}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                            <p className='Title'>Order History</p>
                            <p className='Empty'>You haven’t yet purchased any gift cards.</p>
                        </div>
        let start = this.state.pageIndex*this.maxRecordsPerPage
        let end = start + this.maxRecordsPerPage
        let snippets = this.state.data.slice(start, end).map((info, index)=><OrderSnippet key={index} info={info} />)
        let half = Math.floor(this.maxIndicators / 2)
        let startIndicator, endIndicator
        if(this.state.pageIndex - half < 0){
            startIndicator = 0
            endIndicator = Math.min(this.state.totalPage - 1, startIndicator + this.maxIndicators - 1)
        }
        else if(this.state.pageIndex + half > this.state.totalPage - 1){
            startIndicator = Math.max(0, this.state.totalPage - this.maxIndicators)
            endIndicator = this.state.totalPage - 1
        }   
        else{
            startIndicator = this.state.pageIndex - half
            endIndicator  = this.state.pageIndex + half
        }
        let indicators = []
        for (let i = startIndicator; i <= endIndicator; i++)
            indicators.push(<span key={i} className={this.state.pageIndex===i?"Active":""} onClick={()=>this.Goto(i)}>{i + 1}</span>)
        return  <div id='OrderHistory'>
                        <p className='Goback' onClick={()=>this.props.history.push('account')}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                        <p className='Title'>Order History</p>
                        <div className='Content'>
                            {snippets} 
                        </div>
                        <div className='Pagination'>
                            <p className='Prev'>{this.state.prev?<i className="fas fa-angle-left" onClick={()=>this.Goto(this.state.pageIndex - 1)}></i>:null}</p>
                            {indicators}
                            <p className='Next'>{this.state.next?<i className="fas fa-angle-right" onClick={()=>this.Goto(this.state.pageIndex + 1)}></i>:null}</p>
                        </div>
                    </div>
    }
}

export default OrderHistory