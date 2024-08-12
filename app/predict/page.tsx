"use client";

import { SetStateAction, JSX, SVGProps, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import StackedWidgets from "../components/StackedWidgets";

export default function PredictPage() {
  const [university, setUniversity] = useState<string>("");
  const [cv, setCv] = useState<File | null>(null);
  const [application, setApplication] = useState<File | null>(null);
  const [testScores, setTestScores] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [acceptancePercentage, setAcceptancePercentage] = useState<string>("");
  const [beastModeTips, setBeastModeTips] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [beastMode, setBeastMode] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("university", university);
    if (cv) formData.append("cv", cv);
    if (application) formData.append("application", application);
    if (testScores) formData.append("testScores", testScores);
    formData.append("beastMode", beastMode.toString());

    try {
      const response = await axios.post("/api/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response Data:", response.data);

      if (response.data) {
        setResult(response.data.result || "");
        setAcceptancePercentage(response.data.acceptance_percentage || "");
        setBeastModeTips(response.data.beastModeTips || "");
      } else {
        setError("No response data received");
      }
    } catch (error) {
      console.error("Prediction failed", error);
      setError("Failed to get prediction. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gray-100 text-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 shadow-sm md:px-6 md:py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <BookOpenIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">University Acceptance Predictor</span>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full">
            <img src="/placeholder.svg" width={32} height={32} className="rounded-full" alt="User Avatar" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 md:px-6 md:py-10">
        <div className="container mx-auto max-w-3xl space-y-8">
          <section>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Predict Your University Acceptance</h1>
            <p className="mt-4 text-gray-700">
              Upload your CV, application, and test scores to get an estimate of your chances of getting accepted into
              your dream university.
            </p>
          </section>
          <section>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div>
                <Label htmlFor="university">University Name</Label>
                <Input
                  id="university"
                  type="text"
                  placeholder="Enter the university name"
                  className="mt-1 border-gray-300 rounded-md p-2 w-full"
                  value={university}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => {
                    console.log("University name entered:", e.target.value);
                    setUniversity(e.target.value);
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cv">Upload CV</Label>
                <Input
                  id="cv"
                  type="file"
                  className="mt-1 file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:cursor-pointer w-full"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log("CV file selected:", e.target.files?.[0]);
                    setCv(e.target.files?.[0] || null);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="application">Upload Application (Optional)</Label>
                <Input
                  id="application"
                  type="file"
                  className="mt-1 file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:cursor-pointer w-full"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log("Application file selected:", e.target.files?.[0]);
                    setApplication(e.target.files?.[0] || null);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="testScores">Test Scores</Label>
                <Input
                  id="testScores"
                  type="text"
                  placeholder="Enter your test scores (e.g., SAT: 1400, ACT: 32)"
                  className="mt-1 border-gray-300 rounded-md p-2 w-full"
                  value={testScores}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => {
                    console.log("Test scores entered:", e.target.value);
                    setTestScores(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center mt-4">
                <Label htmlFor="beastMode" className="mr-2">Enable Beast Mode</Label>
                <input
                  id="beastMode"
                  type="checkbox"
                  className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={beastMode}
                  onChange={(e) => setBeastMode(e.target.checked)}
                />
              </div>
              <Button type="submit" className="w-full bg-gray-800 text-white py-3 font-semibold">
                Predict Acceptance
              </Button>
              {loading && <LoadingSpinner loadingText="Loading..." />}
              {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
            </form>
          </section>
          {!result && (
            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-white p-4">
                <h3 className="text-lg font-semibold">Upload Your Documents</h3>
                <p className="mt-2 text-gray-700">
                  Provide your CV, application, and test scores to get an estimate of your chances of getting accepted.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <h3 className="text-lg font-semibold">Receive Personalized Feedback</h3>
                <p className="mt-2 text-gray-700">
                  Our algorithm will analyze your documents and provide you with a detailed report on your acceptance
                  chances.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <h3 className="text-lg font-semibold">Improve Your Application</h3>
                <p className="mt-2 text-gray-700">
                  Use the feedback to identify areas for improvement and strengthen your application.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <h3 className="text-lg font-semibold">Increase Your Chances</h3>
                <p className="mt-2 text-gray-700">
                  With our personalized guidance, you can increase your chances of getting accepted into your dream
                  university.
                </p>
              </div>
            </section>
          )}
          {(acceptancePercentage || result || beastModeTips) && (
            <section className="relative mt-8">
              <StackedWidgets
                acceptancePercentage={acceptancePercentage}
                result={result}
                beastModeTips={beastModeTips}
                beastMode={beastMode}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function BookOpenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}