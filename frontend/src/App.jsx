import { useState } from "react";
import axios from "axios";

const FIELDS = [
  // Add these to your FIELDS array:
  { key: "Patient Id", placeholder: "e.g. 1001", type: "number" },
  { key: "Patient First Name", placeholder: "e.g. John" },
  { key: "Family Name", placeholder: "e.g. Smith" },
  { key: "Father's name", placeholder: "e.g. Robert" },
  { key: "Institute Name", placeholder: "e.g. City Hospital" },
  { key: "Location of Institute", placeholder: "e.g. New York" },
  { key: "Test 1", placeholder: "0 or 1", type: "number" },
  { key: "Test 2", placeholder: "0 or 1", type: "number" },
  { key: "Test 3", placeholder: "0 or 1", type: "number" },
  { key: "Test 4", placeholder: "0 or 1", type: "number" },
  { key: "Test 5", placeholder: "0 or 1", type: "number" },
  { key: "Parental consent", type: "select", options: ["Yes", "Unknown"] },
  { key: "Follow-up", type: "select", options: ["High", "Low", "Unknown"] },
  {
    key: "Autopsy shows birth defect (if applicable)",
    type: "select",
    options: ["Yes", "No", "Not applicable", "Unknown"],
  },
  {
    key: "Place of birth",
    type: "select",
    options: ["Home", "Institute", "Unknown"],
  },
  {
    key: "Birth defects",
    type: "select",
    options: ["Multiple", "Singular", "Unknown"],
  },
  {
    key: "Blood test result",
    type: "select",
    options: [
      "normal",
      "abnormal",
      "slightly abnormal",
      "inconclusive",
      "Unknown",
    ],
  },
  {
    key: "Disorder Subclass",
    type: "select",
    options: [
      "Alzheimer's",
      "Cancer",
      "Cystic fibrosis",
      "Diabetes",
      "Hemochromatosis",
      "Leber's hereditary optic neuropathy",
      "Leigh syndrome",
      "Mitochondrial myopathy",
      "Tay-Sachs",
      "Unknown",
    ],
  },
  { key: "Patient Age", placeholder: "e.g. 25", type: "number" },
  {
    key: "Genes in mother's side",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  {
    key: "Inherited from father",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  { key: "Maternal gene", type: "select", options: ["Yes", "No", "Unknown"] },
  { key: "Paternal gene", type: "select", options: ["Yes", "No", "Unknown"] },
  { key: "Blood cell count (mcL)", placeholder: "e.g. 4500", type: "number" },
  { key: "Mother's age", placeholder: "e.g. 30", type: "number" },
  { key: "Father's age", placeholder: "e.g. 32", type: "number" },
  { key: "Status", type: "select", options: ["Alive", "Deceased"] },
  {
    key: "Respiratory Rate (breaths/min)",
    type: "select",
    options: ["Normal (30-60)", "Tachypnea", "Unknown"],
  },
  {
    key: "Heart Rate (rates/min",
    type: "select",
    options: ["Normal", "Tachycardia", "Unknown"],
  },
  {
    key: "Gender",
    type: "select",
    options: ["Male", "Female", "Ambiguous", "Unknown"],
  },
  {
    key: "Birth asphyxia",
    type: "select",
    options: ["Yes", "No", "No record", "Not available", "Unknown"],
  },
  {
    key: "Folic acid details (peri-conceptional)",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  {
    key: "H/O serious maternal illness",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  {
    key: "H/O radiation exposure (x-ray)",
    type: "select",
    options: ["Yes", "No", "-", "Not applicable", "Unknown"],
  },
  {
    key: "H/O substance abuse",
    type: "select",
    options: ["Yes", "No", "-", "Not applicable", "Unknown"],
  },
  {
    key: "Assisted conception IVF/ART",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  {
    key: "History of anomalies in previous pregnancies",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  { key: "No. of previous abortion", placeholder: "e.g. 0", type: "number" },
  {
    key: "White Blood cell count (thousand per microliter)",
    placeholder: "e.g. 7.5",
    type: "number",
  },
  { key: "Symptom 1", placeholder: "0 or 1", type: "number" },
  { key: "Symptom 2", placeholder: "0 or 1", type: "number" },
  { key: "Symptom 3", placeholder: "0 or 1", type: "number" },
  { key: "Symptom 4", placeholder: "0 or 1", type: "number" },
  { key: "Symptom 5", placeholder: "0 or 1", type: "number" },
];

const DUMMY = {
  "Patient Id": "1001",
  "Patient First Name": "John",
  "Family Name": "Smith",
  "Father's name": "Robert",
  "Institute Name": "City Hospital",
  "Location of Institute": "New York",
  "Test 1": "1",
  "Test 2": "1",
  "Test 3": "0",
  "Test 4": "1",
  "Test 5": "0",
  "Parental consent": "Yes",
  "Follow-up": "High",
  "Autopsy shows birth defect (if applicable)": "Yes",
  "Place of birth": "Institute",
  "Birth defects": "Singular",
  "Blood test result": "abnormal",
  "Disorder Subclass": "Unknown",
  "Patient Age": "5",
  "Genes in mother's side": "Yes",
  "Inherited from father": "No",
  "Maternal gene": "Yes",
  "Paternal gene": "No",
  "Blood cell count (mcL)": "3200",
  "Mother's age": "28",
  "Father's age": "30",
  "Status": "Deceased",
  "Respiratory Rate (breaths/min)": "Tachypnea",
  "Heart Rate (rates/min": "Tachycardia",
  "Gender": "Male",
  "Birth asphyxia": "Yes",
  "Folic acid details (peri-conceptional)": "No",
  "H/O serious maternal illness": "Yes",
  "H/O radiation exposure (x-ray)": "No",
  "H/O substance abuse": "No",
  "Assisted conception IVF/ART": "No",
  "History of anomalies in previous pregnancies": "Yes",
  "No. of previous abortion": "2",
  "White Blood cell count (thousand per microliter)": "14.0",
  "Symptom 1": "1",
  "Symptom 2": "1",
  "Symptom 3": "1",
  "Symptom 4": "1",
  "Symptom 5": "0",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.12)",
  fontSize: 14,
  outline: "none",
  background: "#fafaf8",
  transition: "border-color 0.15s",
};

export default function App() {
  const [formData, setFormData] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.key, ""])),
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const fillDummy = () => setFormData(DUMMY);
  const clearForm = () => {
    setFormData(Object.fromEntries(FIELDS.map((f) => [f.key, ""])));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA BEING SENT:", formData);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const res = await axios.post(`${API}/predict`, { features: formData });
      setResult(res.data);
    } catch {
      setError(
        "Cannot connect to backend. Make sure it is running on port 8000.",
      );
    } finally {
      setLoading(false);
    }
  };

  const confidence = result?.confidence ? parseFloat(result.confidence) : 0;

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "32px 20px",
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-label="Genome logo"
          >
            <circle cx="18" cy="18" r="18" fill="#01696f" />
            <path
              d="M12 10 C12 10 24 14 24 18 C24 22 12 26 12 26"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M24 10 C24 10 12 14 12 18 C12 22 24 26 24 26"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            <line
              x1="13"
              y1="14.5"
              x2="23"
              y2="15.5"
              stroke="white"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <line
              x1="13"
              y1="18"
              x2="23"
              y2="18"
              stroke="white"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <line
              x1="13"
              y1="21.5"
              x2="23"
              y2="20.5"
              stroke="white"
              strokeWidth="1.2"
              opacity="0.8"
            />
          </svg>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1916" }}>
            Genome Disorder Predictor
          </h1>
        </div>
        <p style={{ color: "#6b6a66", fontSize: 15 }}>
          Enter patient genomic and clinical data to predict potential genetic
          disorders.
        </p>
      </header>

      {/* Quick Fill Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button
          onClick={fillDummy}
          style={{
            padding: "8px 16px",
            background: "#f0f9f9",
            color: "#01696f",
            border: "1px solid #cedcd8",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Fill Sample Data
        </button>
        <button
          onClick={clearForm}
          style={{
            padding: "8px 16px",
            background: "white",
            color: "#6b6a66",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Clear Form
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "white",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 24,
            marginBottom: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {FIELDS.map(({ key, placeholder, type, options }) => (
              <div key={key}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b6a66",
                    marginBottom: 5,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {key}
                </label>
                {type === "select" ? (
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#01696f")}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(0,0,0,0.12)")
                    }
                  >
                    <option value="">-- Select --</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type || "text"}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#01696f")}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(0,0,0,0.12)")
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#a0c4c6" : "#01696f",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            letterSpacing: "0.01em",
          }}
        >
          {loading ? "Analyzing..." : "Predict Genetic Disorder"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#fff0f0",
            border: "1px solid #ffcdd2",
            borderRadius: 10,
            color: "#b71c1c",
            fontSize: 14,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {result?.status === "success" && (
        <div
          style={{
            marginTop: 24,
            background: "white",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: 28,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#01696f",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Prediction Result
          </p>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1a1916",
              marginBottom: 16,
            }}
          >
            {result.prediction}
          </h2>

          {/* Confidence Bar */}
          <div style={{ marginBottom: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#6b6a66",
                marginBottom: 6,
              }}
            >
              <span>Model Confidence</span>
              <span style={{ fontWeight: 600, color: "#01696f" }}>
                {result.confidence}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: "#f0f0ee",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${confidence}%`,
                  background:
                    confidence > 75
                      ? "#01696f"
                      : confidence > 50
                        ? "#d19900"
                        : "#a13544",
                  borderRadius: 99,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#6b6a66", marginTop: 12 }}>
            This prediction is based on the entered patient data. Always consult
            a medical professional for clinical decisions.
          </p>
        </div>
      )}

      {result?.status === "failed" && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#fff0f0",
            border: "1px solid #ffcdd2",
            borderRadius: 10,
            color: "#b71c1c",
            fontSize: 14,
          }}
        >
          ⚠️ {result.error}
        </div>
      )}
    </div>
  );
}
