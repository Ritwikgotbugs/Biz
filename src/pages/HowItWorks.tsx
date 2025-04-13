
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import HeaderComponent from "@/components/layout/Header";
import FooterComponent from "@/components/layout/Footer";

const HowItWorks = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary text-white py-16 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">How StartKaro Works</h1>
            <p className="text-xl">
              Your all-in-one platform designed to simplify the startup journey for entrepreneurs in India
            </p>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm mb-4">
                    Step 1
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Create Your Startup Profile</h2>
                  <p className="text-muted-foreground mb-6">
                    Sign up and complete our comprehensive onboarding process designed to capture all essential information about your startup venture.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Answer questions about your business type, sector, and goals</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Upload existing business documents</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Receive a personalized startup roadmap</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2">
                  <img src="https://placehold.co/400x300" alt="Onboarding process" className="rounded-lg shadow-md" />
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <img src="https://placehold.co/400x300" alt="Compliance dashboard" className="rounded-lg shadow-md" />
                </div>
                <div>
                  <div className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm mb-4">
                    Step 2
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Get Your Compliance Report</h2>
                  <p className="text-muted-foreground mb-6">
                    Based on your profile, our system generates a comprehensive compliance report tailored to your specific business needs.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Receive sector-specific legal requirements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Access customized checklist of necessary documents</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Track compliance deadlines with automated reminders</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm mb-4">
                    Step 3
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Build Your Knowledge Base</h2>
                  <p className="text-muted-foreground mb-6">
                    Upload your business documents to create a personalized knowledge base that powers our AI assistant.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Securely store all your business documents</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Automatically extract key information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Create context for AI to provide personalized guidance</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2">
                  <img src="https://placehold.co/400x300" alt="Knowledge base" className="rounded-lg shadow-md" />
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <img src="https://placehold.co/400x300" alt="AI chatbot" className="rounded-lg shadow-md" />
                </div>
                <div>
                  <div className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm mb-4">
                    Step 4
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Chat with Your AI Assistant</h2>
                  <p className="text-muted-foreground mb-6">
                    Interact with our AI assistant that leverages your knowledge base to provide contextual, personalized guidance.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Ask specific questions about your compliance needs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Receive document-specific advice and recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Get help with filling forms and understanding procedures</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 5 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm mb-4">
                    Step 5
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Track Your Progress</h2>
                  <p className="text-muted-foreground mb-6">
                    Monitor your startup's journey through our interactive dashboard that shows your progress and upcoming requirements.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Track completion of compliance requirements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Get notified of upcoming deadlines</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Visualize your startup's growth journey</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2">
                  <img src="https://placehold.co/400x300" alt="Progress tracking" className="rounded-lg shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tech Stack Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Technology Stack</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>React with TypeScript</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>Tailwind CSS for styling</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>shadcn/ui component library</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>React Query for data fetching</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>Framer Motion for animations</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Backend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>Node.js with Express</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>MongoDB for database storage</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>Pinecone for vector database</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>OpenAI for natural language processing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    <span>OCR.space for document text extraction</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Architecture Diagram */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-center">System Architecture</h3>
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <img src="https://placehold.co/800x400" alt="System Architecture" className="max-w-full h-auto" />
              </div>
              <p className="text-sm text-center text-muted-foreground mt-4">
                StartKaro's architecture integrates user data processing, document analysis, and AI-powered recommendations
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-white text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Entrepreneurial Journey?</h2>
            <p className="text-xl mb-8">
              Join thousands of founders who've simplified their startup process with StartKaro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default HowItWorks;
