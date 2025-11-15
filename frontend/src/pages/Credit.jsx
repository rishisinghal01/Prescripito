import React, { useEffect, useState, useContext } from 'react';
import Loading from './Loading';
import { ChatContext } from '../context/Chatcontext';
import { toast } from 'react-toastify';

const Credit = () => {
  const [plans, setplans] = useState([]);
  const [loading, setloading] = useState(true);
  const { token, axios } = useContext(ChatContext);

  const fetchuserPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', {
        headers: { token }
      });

      if (data.success) {
        setplans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plans");
      }
    } catch (err) {
      toast.error(err.message);
    }
    setloading(false);
  };

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post(
        '/api/credit/purchase',
        { planId },
        {
          headers: { token }
        }
      );

      if (data.success) {
        window.location.href= data.url
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchuserPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl h-screen overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow p-6 w-[250px] flex flex-col bg-white"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>

              <p className="text-2xl font-bold text-purple-600 mb-4">
                ${plan.price}
                <span className="text-base font-normal text-gray-600">
                  / {plan.credits} credits
                </span>
              </p>

              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>

            <button
  onClick={() =>
    toast.promise(
      (async () => {
        await purchasePlan(plan._id);
      })(),
      {
        loading: "Processing...",
        success: "Redirecting to Stripe...",
        error: "Payment failed!"
      }
    )
  }
  className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer"
>
  Buy Now
</button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Credit;
