
async function displayRazorpay() {
   
    
    const data = await fetch('/razorpay', { method:'POST'}).then( response => response.json());

    

    const options = {
        key: 'rzp_test_2eJE3rP3gEWqze',
        currency:'INR',
        amount: 200,
        //order_id: data.id,
        name: 'Donation',
        description: 'Thank you for nothing. Please give us some money',
        image: '/images/modiLogo3.png',
        handler: function (response) {
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature);
        },
        prefill: {
            
            email: 'sdfdsjfh2@ndsfdf.com',
            phone_number: '9899999999'
        }
    }
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}
