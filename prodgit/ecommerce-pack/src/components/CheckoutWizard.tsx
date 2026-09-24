import React, { useState } from "react";
import { CartItem } from "../types";
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";

interface CheckoutWizardProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const updateShipping = (
    field: keyof typeof shippingData,
    value: string,
  ) => {
    setShippingData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (
        !shippingData.fullName.trim() ||
        !shippingData.street.trim() ||
        !shippingData.city.trim() ||
        !shippingData.postalCode.trim()
      ) {
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      setIsProcessing(true);

      window.setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
        onOrderSuccess();
      }, 800);
    }
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      style={{
        background: "rgba(15, 23, 42, 0.96)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 24,
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            id="checkout-title"
            style={{
              color: "#f8fafc",
              fontSize: 20,
              margin: 0,
            }}
          >
            Tunnel de commande
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 12,
              margin: "5px 0 0",
            }}
          >
            Étape {step} sur 3
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le tunnel de commande"
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
          fontSize: 12,
          color: "#94a3b8",
        }}
      >
        <span style={{ color: step >= 1 ? "#10b981" : "#64748b" }}>
          1. Livraison
        </span>
        <span>—</span>
        <span style={{ color: step >= 2 ? "#10b981" : "#64748b" }}>
          2. Paiement
        </span>
        <span>—</span>
        <span style={{ color: step >= 3 ? "#10b981" : "#64748b" }}>
          3. Confirmation
        </span>
      </div>

      {step === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h3 style={{ color: "#f8fafc", margin: 0 }}>
            Adresse de livraison
          </h3>

          <input
            value={shippingData.fullName}
            onChange={(event) =>
              updateShipping("fullName", event.target.value)
            }
            placeholder="Nom complet"
            autoComplete="name"
            style={inputStyle}
          />

          <input
            value={shippingData.street}
            onChange={(event) =>
              updateShipping("street", event.target.value)
            }
            placeholder="Adresse"
            autoComplete="street-address"
            style={inputStyle}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <input
              value={shippingData.postalCode}
              onChange={(event) =>
                updateShipping("postalCode", event.target.value)
              }
              placeholder="Code postal"
              autoComplete="postal-code"
              style={inputStyle}
            />

            <input
              value={shippingData.city}
              onChange={(event) =>
                updateShipping("city", event.target.value)
              }
              placeholder="Ville"
              autoComplete="address-level2"
              style={inputStyle}
            />
          </div>

          <button type="button" onClick={handleNext} style={primaryButtonStyle}>
            Continuer vers le paiement
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ color: "#f8fafc", margin: 0 }}>
            Récapitulatif et paiement
          </h3>

          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#cbd5e1",
                fontSize: 13,
              }}
            >
              <span>Articles</span>
              <span>{items.length}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#cbd5e1",
                fontSize: 13,
                marginTop: 10,
              }}
            >
              <span>Livraison</span>
              <span style={{ color: "#34d399" }}>Gratuite</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#f8fafc",
                fontSize: 18,
                fontWeight: 800,
                borderTop: "1px solid rgba(255,255,255,0.1)",
                marginTop: 14,
                paddingTop: 14,
              }}
            >
              <span>Total TTC</span>
              <span style={{ color: "#10b981" }}>
                {total.toFixed(2)} €
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={isProcessing}
            style={{
              ...primaryButtonStyle,
              opacity: isProcessing ? 0.7 : 1,
              cursor: isProcessing ? "wait" : "pointer",
            }}
          >
            <CreditCard size={16} />
            {isProcessing
              ? "Traitement en cours..."
              : "Confirmer le paiement"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0 16px",
          }}
        >
          <CheckCircle2
            size={52}
            color="#10b981"
            style={{ marginBottom: 14 }}
          />

          <h3 style={{ color: "#f8fafc", margin: "0 0 8px" }}>
            Commande confirmée
          </h3>

          <p style={{ color: "#94a3b8", fontSize: 13 }}>
            Votre commande a été enregistrée localement avec succès.
          </p>

          <button
            type="button"
            onClick={onClose}
            style={{
              ...primaryButtonStyle,
              display: "inline-flex",
              marginTop: 16,
            }}
          >
            Fermer
          </button>
        </div>
      )}
    </section>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 8,
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  fontSize: 13,
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  alignSelf: "flex-end",
  background: "#10b981",
  color: "#04130d",
  border: "none",
  padding: "11px 20px",
  borderRadius: 8,
  fontWeight: 800,
  cursor: "pointer",
};
