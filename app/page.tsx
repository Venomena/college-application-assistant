import Link from 'next/link';
import Image from 'next/image';
import { Input } from "../app/components/ui/Input";
import { Button } from "../app/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="sticky top-0 z-10 w-full bg-white shadow-lg py-4">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg" alt="Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-indigo-600">University Application Assistant</span>
          </div>
          <Link href="/chat" legacyBehavior>
            <a className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition duration-300">
              Get Started
            </a>
          </Link>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center w-full">
        <section className="w-full py-24 bg-gradient-to-r from-indigo-50 to-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-indigo-600">
                Your Path to University Success
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                Get accepted into your dream university with our AI assistant. 
              </p>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                 
              </p>
              <div className="mt-10">
                <Link href="/chat" legacyBehavior>
                  <a className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded transition duration-300">
                    Chat with AI
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-800">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mt-4">
              Our AI assistant 
              - helps you finding the right university for you
              - guides you through the entire application process 
              - provides personalized feedback and tips to improve your chances of acceptance.
            </p>
            <div className="mt-10">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <video className="rounded-lg shadow-lg" autoPlay loop muted style={{ clipPath: 'inset(5px 0 5px 0)' }}>
                    <source src="/video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-800">
              Get Started Now
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mt-4">
              Increase your chances of acceptance by using our AI assistant. Upload your CV, application, and other documents, and get personalized feedback.
            </p>
            <div className="mt-10">
              <Link href="/chat" legacyBehavior>
                <a className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded transition duration-300">
                  Chat with AI
                </a>
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <p className="text-lg font-medium text-gray-600">For feedback and improvement advice:</p>
            <Link href="https://twitter.com/VictorGulchenko" legacyBehavior>
              <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                Follow and message me on X (Twitter)
              </a>
            </Link>
          </div>
        </section>
      </main>
      <footer className="w-full py-4 text-center text-sm text-gray-600 bg-white border-t border-gray-200">
        <p>© 2024 whatdoiwantfromlife.com. All rights reserved.</p>
      </footer>
    </div>
  );
}