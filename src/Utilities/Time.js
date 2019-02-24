
let monthNumberMapping = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function DateShow(date){
    let array = date.split('-')
    return monthNumberMapping[Number(array[1]) - 1] + ' ' + array[2] + ', ' + array[0]
}

export function TimeShow(time){
    let array = time.split(' ')
    array[1] = array[1].includes('p')?'PM':'AM'
    return array[0]+array[1]
}