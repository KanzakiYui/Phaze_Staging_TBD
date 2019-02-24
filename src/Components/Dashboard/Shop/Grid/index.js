import React from 'react'
import './index.css'
import placeholder from './placeholder.png'
import GiftCard from '../../GiftCard'
import GiftLogo from '../../GiftLogo'

class Grid extends React.Component{
    constructor(props){
        super(props)
        this.featured = {
            'Canada': ['amazonca', 'starbucksca', 'aircanada', 'cineplex', 'grouponca', 'keg', 'milestones', 'montanas', 'oldnavyca', 'harveys', 'aeca', 'bananarepca', 'swisschalet', 'aerieca', 'kelseys'],
            'United States': [ 'amazonus',  'starbucksus', 'uber', 'bestbuy', 'gamestop', 'walmart',  'hotels', 'sephora', 'amctheatres', 'americanairlines', 'ebay1', 'delta', 'nordstrom', 'wholefoods', 'columbia']
        }
        this.state={
            category: 'All',
            keyword: '',
            filterResults: [],
            isScrolling: false,
            initialX: 0
        }
    }

    componentWillUpdate = (nextProps, nextState) => {
        if(this.state.isScrolling !== nextState.isScrolling ) {
            this.toggleScrolling(nextState.isScrolling)
        }
    }

    toggleScrolling = (isEnable) => {
        if (isEnable) {
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
        } else {
            window.removeEventListener('mousemove', this.onMouseMove);
        }
    }
    
    onMouseMove = (event) => {
        if (this.state.isScrolling) {
            const diff = this.state.initialX  - event.screenX;
            document.getElementsByClassName('Content')[0].scrollBy(diff, 0);
            this.setState({initialX: event.screenX});
        }
    }
  
    onMouseUp =  () => {
        this.setState({
            isScrolling: false
        })
    }
  
    onDragStart = (event) => {
        event.preventDefault();
        this.setState({
            isScrolling: true, 
            initialX: event.screenX
        });
    }
    
    CategoryChanged = (event)=>{
        let element = event.target.closest('span')
        if(!element)
            return
        this.setState({
            category: element.dataset.value
        })
    }
    KeywordChanged = (event)=>{
        if (event.target.value.length === 0)
            this.setState({keyword: '', filterResults: []})
        let value = event.target.value.toLowerCase()
        let array = this.props.brandInfo.filter(item=>item.country===this.props.country).filter(item=>{
            let name = item.name.toLowerCase()
            if(name.includes(value) || value.includes(name))
                return true
            else
                return false
        })
        let result = array.slice(0, 4).map(info=>({name: info.name, code: info.code}))
            this.setState({keyword: event.target.value, filterResults: result})
    }
    CategoryResult = ()=>{
        let array = this.props.brandInfo.filter(item=>item.country===this.props.country)
        if(this.state.category !== 'All')
            array = array.filter(item => item.category === this.state.category)
        return array
    }
    Chose = (event)=>{
        let element = event.target.closest('*[data-value]')
        if(!element)
            return
        this.props.SelectBrand(element.dataset.value)
    }
    render(){
        let featuredCards = this.featured[this.props.country].map((card, index)=><GiftCard key={index} urlpath={card}/>)
        let allLogos = this.CategoryResult().map((info, index)=><GiftLogo key={index} urlpath={info.code}/>)
        let filterResult = null
        let borderClass = ""
        if(this.state.keyword&&this.state.filterResults.length===0){
            filterResult = <p className='Error'>There are no results with the term "{this.state.keyword}"...</p>
            borderClass = "error"
        }
        else if(this.state.keyword&&this.state.filterResults.length !== 0){
            let items = this.state.filterResults.map((value, index)=><p key={index} data-value={value.code}>{value.name}</p>)
            filterResult = <div className='Results' onClick={this.Chose}>
                                    {items}
                                </div>
        }
        return  <div id='Shop-Grid'>
                        <div id='Grid-Desktop-Background'>
                            <img src={placeholder} alt="" />
                        </div>
                        <div id='Grid-Main'>
                            <div id='Grid-Featured'>
                                <p className='Title'>Featured</p>
                                <div className='Content' 
                                     onClick={(event)=>this.Chose(event)}
                                     onDragStart={this.onDragStart}
                                >
                                    {featuredCards}
                                </div>
                            </div>
                            <div id='Grid-Category' onClick={(event)=>this.CategoryChanged(event)}>
                                <span data-value="All" className={this.state.category==='All'?"Active":""}>All cards</span>
                                <span data-value="Entertainment" className={this.state.category==='Entertainment'?"Active":""}>Entertainment</span>
                                <span data-value="Fashion" className={this.state.category==='Fashion'?"Active":""}>Fashion</span>
                                <span data-value="Restaurant" className={this.state.category==='Restaurant'?"Active":""}>Restaurant</span>
                                <span data-value="Travel" className={this.state.category==='Travel'?"Active":""}>Travel</span>
                                <span data-value="Retail" className={this.state.category==='Retail'?"Active":""}>Retail</span>
                                <span data-value="Others" className={this.state.category==='Others'?"Active":""}>Others</span>
                            </div>
                            <div id='Grid-AllBrands' onClick={(event)=>this.Chose(event)}>
                                {allLogos}
                            </div>cd 
                        </div>
                        {this.props.openSearch?
                            <div id='Shop-Search-Overlay'>
                                <i className="fas fa-times" onClick={this.props.CloseSearch}></i>
                                <form noValidate>
                                    <div className='Inline-Input'>
                                        <input className={borderClass} id='shop-search' type='text' maxLength='30' placeholder='type a keyword' spellCheck="false" autoComplete="false" value={this.state.keyword} onChange={(event)=>this.KeywordChanged(event)}></input>
                                        <label htmlFor='shop-search'>
                                            <i className="fas fa-search"></i>
                                        </label>
                                    </div>
                                </form>
                                {filterResult}
                            </div>
                            :null
                        }
                    </div>
    }
}

export default Grid

