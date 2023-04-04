import axios from "axios";

export const USD_INR_CONVERSION_FACTOR = 77.6

const verifyPaymentStatus = async (order_id, razorpay_payment_id, payment_sig, uid, transactionAmount, toastContainer) => {
    try {
        const payload = {
            oid: order_id,
            rpid: razorpay_payment_id,
            rsig: payment_sig,
            userId: uid,
            amount: transactionAmount
        }
        const { data } = await axios.post("wallet/razorpay/verify-signature", payload)
        if (!data.error) {
            toastContainer.success(
                <div>
                    <b>Payment Success!</b>
                    <p>Please Wait...</p>
                </div>
            )
            setTimeout(() => {
                window.location.reload()
            }, 2000);
            // else throw new Error("Wallet balance would be updated soon.")
        }
        else {
            toastContainer.error(
                <div>
                    <b>Payment Failed.</b>
                </div>
            )
        }
    } catch (error) {
        console.log(error);
    }
}

export default async function beginPayment(currency, amount, userData, toastContainer) {
    if (amount <= 0) {
        alert("Invalid Amount")
        return
    }
    amount = parseFloat(amount).toFixed(2)
    const cc = amount
    const payload = {
        currency: currency,
        amount: currency === "INR" ? parseFloat((amount * USD_INR_CONVERSION_FACTOR).toFixed(2)) : amount,
        cc: cc
    }
    console.log(payload);
    const { data } = await axios.post("wallet/razorpay", payload)

    const options = {
        key: `rzp_test_Z0tSd0kuYvcgmy`,
        currency: data.currency,
        amount: data.amount,
        name: "Recharge Wallet",
        description: `Adding ${cc} KisanCoins to wallet.`,
        order_id: data.id,
        handler: function (response) {
            verifyPaymentStatus(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, userData._id, cc, toastContainer)
        },
        prefill: {
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
        },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}