var $form = $('#checkout-form');
async function displayRazorpay() {
   const data = await fetch('http://localhost:3000/razorpay').then((t) =>
			t.json()
		);
   
   console.log(data.amount);
    

    const options = {
        key: 'rzp_test_2eJE3rP3gEWqze',
        amount: data.amount,
        order_id: data.id,
        name: 'Donation',
        description: 'Thank you for nothing. Please give us some money',
        image: '/images/modiLogo3.png',
        handler: function (response) {
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature);
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
    }
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}
