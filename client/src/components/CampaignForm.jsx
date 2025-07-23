"use client";

import { useState } from "react";
import axios from "axios";
import RuleBuilder from "./RuleBuilder";
import { toast } from "react-toastify";
import { PageHeader } from "./page-header";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sparkles, Send, Users } from "lucide-react";

const CampaignForm = () => {
  const [rules, setRules] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  const [audienceSize, setAudienceSize] = useState(null);
  const [audiencePreviewed, setAudiencePreviewed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState(""); // state for input

  // Feature 1: Convert Natural Language to Segment Rules
  const convertNaturalLanguageToRules = async () => {
    if (!naturalLanguagePrompt.trim()) {
      toast.warning("Please enter a valid prompt.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_GROQ_BASE_URL}/chat/completions`,
        {
          model: "llama-3.3-70b-versatile", // Use the appropriate model
          messages: [
            {
              role: "user",
              content: `You are a rules generator. Convert the following natural language prompt into logical audience rules:
              "${naturalLanguagePrompt}"
              Provide the rules in this format strictly: [{ "field": "fieldName", "operator": operator(symbol as string), "value": value(numeric) }] fieldname can only be out of and as it is in [totalSpend, visits, inactiveDays]`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Log the raw response for debugging
      console.log("AI Response:", res.data);

      // Extract the raw response from the AI
      let generatedRules = res.data.choices[0].message.content;

      // Clean up the response to ensure it's valid JSON
      const jsonStartIndex = generatedRules.indexOf("[");
      const jsonEndIndex = generatedRules.lastIndexOf("]") + 1;

      // Ensure that the content contains valid JSON
      const validJsonString = generatedRules.slice(jsonStartIndex, jsonEndIndex);

      // Now parse the valid JSON string
      const parsedRules = JSON.parse(validJsonString);

      // Ensure that values are converted to numbers (if possible)
      const formattedRules = parsedRules.map(rule => ({
        ...rule,
        value: isNaN(Number(rule.value)) ? rule.value : Number(rule.value),
      }));
      console.log("Formatted Rules:", formattedRules);
      
      // Update the state with the formatted rules
      setRules(formattedRules);
    } catch (err) {
      console.error("Error converting natural language to rules:", err);
      toast.error("Failed to convert prompt into rules.");
    }
  };

  const generateMessage = async () => {
    if (!rules.length) {
      toast.warning("Please add at least one rule before generating a message.");
      return;
    }

    const summary = rules.map((r) => `${r.field} ${r.operator} ${r.value}`).join(" AND ");
    setIsGenerating(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_GROQ_BASE_URL}/chat/completions`,
        {
          model: "llama-3.3-70b-versatile", // Change model as required
          messages: [
            {
              role: "user",
              content: `You are a text generator that provides only the requested content without any additional explanation or conversational elements.

              Suggest a properly formatted message for an audience where: ${summary}

              Only return the main content in a professional tone along with offers.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAiMessage(res.data.choices[0].message.content);
      toast.success("Message generated successfully.");
    } catch (err) {
      console.error("AI message generation failed:", err.response?.data || err.message);
      toast.error("Failed to generate AI message.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rules.length) {
      toast.warning("Please add at least one rule.");
      return;
    }

    if (rules.some((rule) => rule.value === "" || isNaN(Number(rule.value)))) {
      toast.error("All rule values must be valid numbers.");
      return;
    }

    if (!aiMessage.trim()) {
      toast.warning("AI message is empty. Please generate it before submitting.");
      return;
    }

    if (!audiencePreviewed) {
      toast.warning("Please preview the audience before submitting.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      rules: rules.map((r) => ({
        field: r.field,
        operator: r.operator,
        value: Number(r.value),
      })),
      message: aiMessage.trim(),
      audienceSize: Number(audienceSize),
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/campaigns`, payload, {
        withCredentials: true,
      });

      // Assuming the backend returns a campaign ID or success response
      if (res.data && res.data.campaignId) {
        toast.success("Campaign created successfully!");

        // Redirect after success
        setTimeout(() => {
          window.location.href = "/history";
        }, 1000);
      } else {
        toast.error("Failed to create campaign. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting campaign:", err.response?.data || err.message);
      toast.error("Failed to create campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Create New Campaign"
        description="Build audience rules, generate tailored messages, and launch your campaign."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Audience Targeting</CardTitle>
            <CardDescription>Define rules to target specific customer segments</CardDescription>
          </CardHeader>
          <CardContent>
            <RuleBuilder
              rules={rules}
              setRules={setRules}
              setAudienceSize={setAudienceSize}
              setAudiencePreviewed={setAudiencePreviewed}
            />

            {audienceSize !== null && (
              <div className="mt-4 bg-indigo-50 p-4 rounded-md flex items-center">
                <Users className="h-5 w-5 text-indigo-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-indigo-700">Estimated Audience Size</p>
                  <p className="text-xl font-semibold text-indigo-900">{audienceSize} customers</p>
                </div>
              </div>
            )}

            {/* Natural language prompt input */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter natural language prompt (e.g., People who haven’t shopped in 6 months)"
                className="w-full p-2 border rounded"
                value={naturalLanguagePrompt}
                onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
              />
              <Button
                type="button"
                onClick={convertNaturalLanguageToRules}
                className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Convert to Rule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Message</CardTitle>
            <CardDescription>Generate and customize your campaign message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" onClick={generateMessage} disabled={isGenerating || !rules.length} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating Message..." : "Generate AI Message"}
            </Button>

            <div className="border rounded-md">
              <div className="flex items-center justify-between border-b px-4 py-2 bg-gray-50">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-indigo-500 mr-2" />
                  <span className="text-sm font-medium">AI-Generated Message</span>
                </div>
                {aiMessage && <Badge variant="success">Generated</Badge>}
              </div>
              <textarea
                className="w-full p-4 min-h-[200px] text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-b-md"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="AI-generated message will appear here. You can edit it after generation."
              />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <Button type="submit" disabled={isSubmitting || !aiMessage.trim()} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Campaign"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CampaignForm;
