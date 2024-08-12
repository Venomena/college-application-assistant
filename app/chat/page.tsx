"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";
import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import Tips from "../components/Tips";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("Analyzing requirements...");
  const [formState, setFormState] = useState({
    university: "",
    satScore: "",
    gpa: "",
    cvFile: null as File | null,
    others: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("/api/auth/session");
        if (!res.data.session) {
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchSession();
  }, [router]);

  const sendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    setLoadingText("Analyzing requirements...");

    const formData = new FormData();
    formData.append("message", message);
    formData.append("university", formState.university);
    formData.append("satScore", formState.satScore);
    formData.append("gpa", formState.gpa);
    if (formState.cvFile) formData.append("cv", formState.cvFile);
    formData.append("others", formState.others);

    try {
      const response = await axios.post("/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: () => setLoadingText("Uploading documents..."),
      });

      if (response.data && response.data.message) {
        setLoadingText("Processing documents...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoadingText("Searching for current data...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoadingText("Compiling results...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setMessages((prev) => [
          ...prev,
          { role: "ai", content: response.data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Sorry, I couldn't process your request. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "An error occurred while processing your request. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setFormState((prev) => ({ ...prev, cvFile: file }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isReadyToChat = formState.cvFile && (formState.satScore || formState.gpa || formState.others);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-black">
      <div className="flex-1 flex flex-col p-4">
        <header className="text-center py-4 border-b bg-white shadow-md">
          <h1 className="text-2xl font-bold">College Application Assistant 🎓</h1>
          <p className="text-sm text-gray-600">Upload your documents and enter your details to get personalized college application assistance.</p>
        </header>
        <div className="flex flex-col flex-1 overflow-hidden bg-white shadow-md rounded-lg">
          <ChatBox messages={messages} />
          {loading && <LoadingSpinner loadingText={loadingText} />}
          <ChatInput
            onSendMessage={sendMessage}
            onBeastModeChange={() => {}}
          />
        </div>
      </div>
      <div className="md:w-1/3 p-6 border-t md:border-t-0 md:border-l bg-white shadow-md rounded-lg">
        <div className="block md:hidden">
          <button
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? "Hide Uploads" : "Show Uploads"}
          </button>
        </div>
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:block`}>
          <h2 className="text-xl font-semibold mb-4">Upload Documents (PDF)</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="cv">Upload CV/resume (PDF)</Label>
              <Input id="cv" type="file" name="cv" onChange={handleFileChange} />
            </div>
            <div>
              <Label htmlFor="university">Dream University (Optional)</Label>
              <Input
                id="university"
                type="text"
                name="university"
                value={formState.university}
                onChange={handleInputChange}
                placeholder="Enter your dream university"
              />
            </div>
            <div>
              <Label htmlFor="satScore">SAT Score (Optional)</Label>
              <Input
                id="satScore"
                type="text"
                name="satScore"
                value={formState.satScore}
                onChange={handleInputChange}
                placeholder="Enter your SAT score"
              />
            </div>
            <div>
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                type="text"
                name="gpa"
                value={formState.gpa}
                onChange={handleInputChange}
                placeholder="Enter your GPA"
              />
            </div>
            <div>
              <Label htmlFor="others">International Scores (Optional)</Label>
              <Input
                id="others"
                type="text"
                name="others"
                value={formState.others}
                onChange={handleInputChange}
                placeholder="Enter other scores"
              />
            </div>
          </form>
          <Tips />
        </div>
      </div>
    </div>
  );
}