import success from "../assets/success.svg";

export default function StripeSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-deepBlue/20">
      <div className="bg-white rounded-xl shadow-lg max-w-md pb-12 w-full text-center">
        <img src={success} alt="success" className="" />
        <h1 className="text-3xl font-bold my-4 text-primary">
          Payment Successful
        </h1>
        <p className="mb-6 text-secondary">
          Thank you for your payment. Your transaction was successful.
        </p>
      </div>
    </div>
  );
}
