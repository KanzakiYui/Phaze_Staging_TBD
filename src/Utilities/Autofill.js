function AutofillLink(brandcode, code, pin){
    switch(brandcode){
        case 'amazonca':
            return 'https://www.amazon.ca/gp/css/gc/payment?claimCode='+code
        case 'amazonus':
            return 'https://www.amazon.com/gp/css/gc/payment?claimCode='+code
        case 'starbucksca':
            return 'https://www.starbucks.ca/accountcard/transfer'
        case 'starbucksus':
            return 'https://www.starbucks.com/accountcard/transfer'
        case 'cineplex':
            return 'https://www.cineplex.com/connect?ConnectStartUpPage=50'
        case 'walmart':
            return 'https://www.walmart.com/account/giftcards'
        case 'timhortonsca':
            return 'https://timcard.prepaidaccess.com/consumer/account/home'
        case 'uber':
            return 'https://m.uber.com/payments/add-promotion'
        case 'grouponca':
            return 'https://www.groupon.com/giftcards'
        case 'milestones':
            return 'https://theultimatediningcard.ca/udc/my-account/manage-cards.html'
        case 'montanas':
            return 'https://theultimatediningcard.ca/udc/my-account/manage-cards.html'
        case 'amctheatres':
            return 'https://www.amctheatres.com/amcstubs/wallet'
        default:
            return null
    }
}

export default AutofillLink