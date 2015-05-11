
module.exports = {
    db: {
      connection_string:'mongodb://localhost/ccas'
    },
    suppliers: {
        ACME:{
            url:'http://localhost:3050',
            order_endpoint:'/acme/api/v45.1/order',
            api_key:'cascade.53bce4f1dfa0fe8e7ca126f91b35d3a6',
            models:['anvil','wile','roadrunner'],
            packages:['std','super','elite']
        },
        RAINER:{
            url:'http://localhost:3051',
            nonce_endpoint:'/r/nonce_token',
            order_endpoint:'/r/request_customized_model',
            storefront_id:'ccas-bb9630c04f',
            models:['pugetsound','olympic'],
            packages: ['mtn','ltd','14k']
        }
    }
}