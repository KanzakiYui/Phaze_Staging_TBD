let Debounce = (handler, delay) =>{
    delay = delay || 200                                // default is 200ms delay
    let timer                                                  // closure
    return function(event){
        if(timer)
            clearTimeout(timer)
        timer = setTimeout(handler, delay, event)
    }
}

export default Debounce
