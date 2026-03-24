
  import { useEffect, useState } from "react";
import { Hero } from "./components/Hero";
import { ImpactSection } from "./components/ImpactSection";
import { ImageGallerySection } from "./components/ImageGallerySection";
import { ProgramSection } from "./components/ProgramSection";
import { InvolvementSection } from "./components/InvolvementSection";
import { DonationSection } from "./components/DonationSection";
import { VolunteerForm } from "./components/VolunteerForm";
import { Footer } from "./components/Footer";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

const fallbackData = {
  impact: [
    { label: "Meals Delivered", value: "18K+" },
    { label: "Children Supported", value: "4.2K" },
    { label: "Active Volunteers", value: "260+" }
  ],
  programs: [
    {
      title: "Education Access",
      description: "Scholarships, digital classrooms, and community learning hubs."
    },
    {
      title: "Health Outreach",
      description: "Mobile checkups, medicine drives, and preventive health camps."
    },
    {
      title: "Women Empowerment",
      description: "Skill training, mentorship, and micro-entrepreneurship support."
    }
  ],
  involvement: [
    "Volunteer on weekends with local field teams.",
    "Sponsor education and nutrition kits for a family.",
    "Partner with us for CSR and long-term community impact."
  ],
  images: []
};

function App() {
  const [ngoData, setNgoData] = useState(fallbackData);
  const [submitState, setSubmitState] = useState({
    loading: false,
    message: ""
  });
  const [donationState, setDonationState] = useState({
    loading: false,
    message: "",
    certificateUrl: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/ngo`);
        if (!response.ok) {
          throw new Error("Unable to fetch NGO data");
        }

        const data = await response.json();
        setNgoData(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const handleVolunteerSubmit = async (formData) => {
    setSubmitState({ loading: true, message: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to submit volunteer request");
      }

      setSubmitState({
        loading: false,
        message: "Thanks for joining. Our NGO team will contact you soon."
      });
    } catch (error) {
      setSubmitState({
        loading: false,
        message: error.message
      });
    }
  };

  const handleDonationSubmit = async (formData) => {
    setDonationState({
      loading: true,
      message: "",
      certificateUrl: ""
    });

    try {
      const orderResponse = await fetch(`${apiBaseUrl}/api/donations/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const orderPayload = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderPayload.message || "Unable to start donation");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK did not load");
      }

      return await new Promise((resolve) => {
        const razorpay = new window.Razorpay({
          key: orderPayload.key,
          amount: orderPayload.amount,
          currency: orderPayload.currency,
          name: "Sri Ram Charitable Trust, Jammu",
          description: formData.purpose,
          order_id: orderPayload.orderId,
          prefill: {
            name: formData.donorName,
            email: formData.email
          },
          theme: {
            color: "#1d6b61"
          },
          handler: async (paymentResponse) => {
            try {
              const verifyResponse = await fetch(`${apiBaseUrl}/api/donations/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  donationId: orderPayload.donationId,
                  ...paymentResponse
                })
              });

              const verifyPayload = await verifyResponse.json();

              if (!verifyResponse.ok) {
                throw new Error(verifyPayload.message || "Payment verification failed");
              }

              setDonationState({
                loading: false,
                message: "Donation successful. Certificate is ready.",
                certificateUrl: verifyPayload.certificateUrl
              });
              resolve(true);
            } catch (error) {
              setDonationState({
                loading: false,
                message: error.message,
                certificateUrl: ""
              });
              resolve(false);
            }
          },
          modal: {
            ondismiss: () => {
              setDonationState({
                loading: false,
                message: "Payment window was closed before completion.",
                certificateUrl: ""
              });
              resolve(false);
            }
          }
        });

        razorpay.open();
      });
    } catch (error) {
      setDonationState({
        loading: false,
        message: error.message,
        certificateUrl: ""
      });
      return false;
    }
  };

  return (
    <div className="page-shell">
      <Hero />
      <main>
        <ImpactSection items={ngoData.impact} />
        <ProgramSection programs={ngoData.programs} />
        <ImageGallerySection images={ngoData.images} />
        <InvolvementSection involvement={ngoData.involvement} />
        <DonationSection
          onSubmit={handleDonationSubmit}
          loading={donationState.loading}
          message={donationState.message}
          certificateUrl={donationState.certificateUrl}
        />
        <VolunteerForm
          onSubmit={handleVolunteerSubmit}
          loading={submitState.loading}
          message={submitState.message}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
