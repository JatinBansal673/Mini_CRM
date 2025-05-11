import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FIELDS = [
  { label: "Total Spend", value: "totalSpend" },
  { label: "Visits", value: "visits" },
  { label: "Inactive Days", value: "inactiveDays" },
];

const OPERATORS = [">", "<", "=", ">=", "<="];

const RuleBuilder = ({ rules, setRules, setAudienceSize, setAudiencePreviewed }) => {
  const addRule = () => {
    setRules([...rules, { field: "totalSpend", operator: ">", value: "" }]);
    setAudiencePreviewed(false);
  };

  const updateRule = (index, key, value) => {
    const newRules = [...rules];
    newRules[index][key] = value;
    setRules(newRules);
    setAudiencePreviewed(false);
  };

  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    setAudiencePreviewed(false);
  };

  const previewAudience = async () => {
    if (!rules.length) {
      toast.error("Please add at least one rule before previewing.");
      return;
    }
    
    const hasInvalidValues = rules.some(rule => {
      const val = rule.value;
      return val === undefined || val === null || String(val).trim() === "" || isNaN(Number(val));
    });
    
    if (hasInvalidValues) {
      toast.error("Please enter valid numeric values before previewing.");
      return;
    }
    
    

    try {
      const res = await axios.post("http://localhost:5000/api/customers/preview", {
        rules: rules.map(r => ({
          ...r,
          value: Number(r.value),
        })),
      });
      setAudienceSize(res.data.count);
      setAudiencePreviewed(true);
      toast.success(`Audience previewed: ${res.data.count} customers.`);
    } catch (err) {
      console.error("Preview failed:", err);
      toast.error("Failed to preview audience.");
      setAudienceSize("Error");
    }
  };

  return (
    <div className="p-4 bg-gray-50 border rounded shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">🧮 Audience Rule Builder</h2>

      {rules.map((rule, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded shadow-sm">
          <select
            value={rule.field}
            onChange={(e) => updateRule(i, "field", e.target.value)}
            className="col-span-4 border p-2 rounded"
          >
            {FIELDS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          <select
            value={rule.operator}
            onChange={(e) => updateRule(i, "operator", e.target.value)}
            className="col-span-2 border p-2 rounded"
          >
            {OPERATORS.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>

          <input
            type="number"
            value={rule.value}
            onChange={(e) => updateRule(i, "value", e.target.value)}
            className="col-span-4 border p-2 rounded"
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            placeholder="Enter value"
          />

          <button
            onClick={() => removeRule(i)}
            className="col-span-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={addRule}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Rule
        </button>

        <button
          type="button"
          onClick={previewAudience}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          👁️ Preview Audience
        </button>
      </div>
    </div>
  );
};

export default RuleBuilder;
