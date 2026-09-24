import React, { useState, useEffect } from "react";
import { SaasService, SaasState, SAAS_PLANS } from "../services/saasService";
import {
  TrendingUp,
  CreditCard,
  Users,
  Shield,
  Plus,
  Download,
  CheckCircle2,
  Zap,
  Activity,
  Trash2,
} from "lucide-react";

interface SaasDashboardProps {
  defaultTab?: "dashboard" | "billing" | "team" | "overview";
}

export const SaasDashboard: React.FC<SaasDashboardProps> = ({ defaultTab }) => {
  const [state, setState] = useState<SaasState>(SaasService.getState());
  const resolvedDefault =
    defaultTab === "dashboard"
      ? "overview"
      : (defaultTab as "overview" | "billing" | "team") ?? "overview";
  const [activeTab, setActiveTab] = useState<"overview" | "billing" | "team">(
    resolvedDefault
  );
  const [notice, setNotice] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Developer" | "Viewer">("Developer");

  useEffect(() => {
    const unsubscribe = SaasService.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handlePlanUpgrade = (planId: string) => {
    SaasService.changePlan(planId, state.billingCycle);
    const planName = SAAS_PLANS.find((p) => p.id === planId)?.name;
    showToast("✓ Plan " + planName + " activé immédiatement ! Proration et facture générées.");
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    SaasService.inviteMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteName("");
    setInviteEmail("");
    setShowInviteModal(false);
    showToast("✓ Invitation envoyée avec succès à " + inviteEmail + " !");
  };

  const handleRemoveMember = (id: string, name: string) => {
    SaasService.removeMember(id);
    showToast("Membre " + name + " retiré de l'espace.");
  };

  const currentPlan =
    SAAS_PLANS.find((p) => p.id === state.currentPlanId) || SAAS_PLANS[1];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "10px 0" }}>
      {notice && (
        <div
          style={{
            padding: "12px 20px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
          }}
        >
          <CheckCircle2 size={18} color="#fff" />
          <span>{notice}</span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#0EA5E9",
              background: "rgba(14, 165, 233, 0.15)",
              padding: "2px 8px",
              borderRadius: 4,
              textTransform: "uppercase",
            }}
          >
            SaaS Billing & MRR Engine
          </span>
          <h1
            style={{
              margin: "6px 0 0 0",
              fontSize: "24px",
              fontWeight: 900,
              color: "#f8fafc",
            }}
          >
            🧾 PACK SAAS BILLING PRO
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            background: "rgba(255, 255, 255, 0.03)",
            padding: 4,
            borderRadius: 10,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "12.5px",
              fontWeight: activeTab === "overview" ? 700 : 500,
              background:
                activeTab === "overview"
                  ? "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)"
                  : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Vue d'ensemble KPIs
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "12.5px",
              fontWeight: activeTab === "billing" ? 700 : 500,
              background:
                activeTab === "billing"
                  ? "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)"
                  : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <CreditCard size={14} /> Facturation & Plans
          </button>
          <button
            onClick={() => setActiveTab("team")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "12.5px",
              fontWeight: activeTab === "team" ? 700 : 500,
              background:
                activeTab === "team"
                  ? "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)"
                  : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Users size={14} /> Équipe ({state.team.length})
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Revenu Récurrent Mensuel (MRR)</span>
                <TrendingUp size={16} color="#10b981" />
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#38bdf8",
                  margin: "8px 0 4px",
                }}
              >
                {state.mrr.toFixed(2)} €
              </div>
              <div style={{ fontSize: "11px", color: "#34d399" }}>
                +14.2% vs mois précédent
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Revenu Récurrent Annuel (ARR)</span>
                <Activity size={16} color="#6366f1" />
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#a78bfa",
                  margin: "8px 0 4px",
                }}
              >
                {state.arr.toFixed(2)} €
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Projection sur 12 mois
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Plan Actif</span>
                <Shield size={16} color="#f59e0b" />
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#f8fafc",
                  margin: "8px 0 4px",
                }}
              >
                {currentPlan.name}
              </div>
              <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                Cycle : {state.billingCycle === "monthly" ? "Mensuel" : "Annuel"}
              </div>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Utilisation API</span>
                <Zap size={16} color="#10b981" />
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#f8fafc",
                  margin: "8px 0 4px",
                }}
              >
                {((state.usage.apiCalls / state.usage.apiLimit) * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                {state.usage.apiCalls.toLocaleString()} / {state.usage.apiLimit.toLocaleString()} requêtes
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 14,
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                ⚡ Simulateur d'Appels API Réactifs
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Testez la mise à jour réactive des métriques et le dépassement de quota.
              </div>
            </div>
            <button
              onClick={() => {
                SaasService.incrementApiUsage(2500);
                showToast("✓ 2 500 requêtes API simulées avec succès !");
              }}
              style={{
                background: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Simuler 2 500 Requêtes API
            </button>
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {SAAS_PLANS.map((plan) => {
              const isCurrent = state.currentPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  style={{
                    background: isCurrent
                      ? "rgba(14, 165, 233, 0.12)"
                      : "rgba(15, 23, 42, 0.75)",
                    border: isCurrent
                      ? "2px solid #0EA5E9"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 16,
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isCurrent
                      ? "0 10px 30px rgba(14, 165, 233, 0.25)"
                      : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: 800,
                          color: "#f8fafc",
                          margin: 0,
                        }}
                      >
                        {plan.name}
                      </h3>
                      {plan.recommended && (
                        <span
                          style={{
                            fontSize: "10px",
                            background: "#0EA5E9",
                            color: "#000",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontWeight: 800,
                          }}
                        >
                          RECOMMANDÉ
                        </span>
                      )}
                    </div>

                    <div style={{ margin: "16px 0" }}>
                      <span
                        style={{
                          fontSize: "32px",
                          fontWeight: 900,
                          color: "#f8fafc",
                        }}
                      >
                        {plan.priceMonthly} €
                      </span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {" "}
                        / mois
                      </span>
                    </div>

                    <ul
                      style={{
                        paddingLeft: 18,
                        fontSize: "12.5px",
                        color: "#cbd5e1",
                        lineHeight: 1.8,
                        margin: "0 0 20px 0",
                      }}
                    >
                      {plan.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePlanUpgrade(plan.id)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      background: isCurrent
                        ? "rgba(14, 165, 233, 0.2)"
                        : "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
                      color: isCurrent ? "#38bdf8" : "#fff",
                      border: isCurrent ? "1px solid #0EA5E9" : "none",
                    }}
                  >
                    {isCurrent ? "✓ Plan Actuellement Actif" : "Passer au plan " + plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 14,
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 16px 0",
              }}
            >
              Historique des Factures Générées
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {state.invoices.map((inv) => (
                <div
                  key={inv.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: 8,
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        padding: "8px",
                        background: "rgba(14, 165, 233, 0.1)",
                        borderRadius: 6,
                        color: "#38bdf8",
                      }}
                    >
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>
                        {inv.number} — Plan {inv.planName}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{inv.date}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>
                      {inv.amount.toFixed(2)} €
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#34d399",
                      }}
                    >
                      PAYÉE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 14,
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  Collaborateurs de l'Espace ({state.team.length} / {currentPlan.maxUsers})
                </h3>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}>
                  Gérez les permissions et invitez de nouveaux membres.
                </p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                style={{
                  background: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Plus size={15} /> Inviter un Membre
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {state.team.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 18px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: 10,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#f8fafc" }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>{member.email}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 6,
                        background:
                          member.role === "Owner"
                            ? "rgba(14, 165, 233, 0.2)"
                            : "rgba(255, 255, 255, 0.06)",
                        color: member.role === "Owner" ? "#38bdf8" : "#cbd5e1",
                      }}
                    >
                      {member.role}
                    </span>

                    {member.role !== "Owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        title="Retirer le collaborateur"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: 24,
              maxWidth: 440,
              width: "90%",
            }}
          >
            <h3 style={{ fontSize: "18px", color: "#f8fafc", margin: "0 0 6px" }}>
              Inviter un Collaborateur
            </h3>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: 20 }}>
              Ajoutez un membre à votre équipe et attribuez-lui un rôle.
            </p>

            <form onSubmit={handleInviteSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Nom complet (ex: Claire Martin)"
                required
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email professionnel"
                required
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#0b0f19",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                <option value="Admin">Admin (Tous droits)</option>
                <option value="Developer">Developer (Lecture/Écriture)</option>
                <option value="Viewer">Viewer (Lecture seule)</option>
              </select>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    color: "#cbd5e1",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "#0EA5E9",
                    color: "#000",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
