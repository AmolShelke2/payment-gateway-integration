import logo from "./logo.svg";
import "./App.css";

function App() {
  const amount = 500;
  const currency = "INR";
  const recieptID = "abEbsAs";

  async function paymentHandler(e) {
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        receipt: recieptID,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    const options = {
      key: "rzp_test_R2NUnKT1xkFWB6",
      amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: currency,
      name: "KredAllino Technology ", //your business name
      description: "Test Transaction",
      image: "",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validatePaymentRes = await fetch(
          "http://localhost:5000/order/validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validatePaymentRes.json();
        console.log(jsonRes, "After validation");
      },
      prefill: {
        name: "Amol Shelke", //your customer's name
        email: "amol.shelke@example.com",
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    let rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
    e.preventDefault();
  }

  return (
    <div className="product-wrapper">
      <div className="product-card">
        <img
          src="https://cdn.dribbble.com/userupload/5297150/file/original-c0655144648b780dda154a62a1819cda.png?resize=1024x768"
          alt="design-product"
        />
        <div className="footer">
          <p>₹ 500</p>
          <button onClick={paymentHandler}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default App;
