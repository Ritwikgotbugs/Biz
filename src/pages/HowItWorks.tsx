import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="flex flex-col min-h-screen">
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
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2 overflow-hidden">
                  <img 
                    src="/images/how-it-works/onboarding-process.png" 
                    alt="Onboarding process" 
                    className="rounded-lg shadow-md w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80";
                    }}
                  />
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/how-it-works/compliance-dashboard.png" 
                    alt="Compliance dashboard" 
                    className="rounded-lg shadow-md w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80";
                    }}
                  />
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
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2 overflow-hidden">
                  <img 
                    src="/images/how-it-works/knowledge-base.png" 
                    alt="Knowledge base" 
                    className="rounded-lg shadow-md w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                    }}
                  />
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/how-it-works/ai-chatbot.png" 
                    alt="AI chatbot" 
                    className="rounded-lg shadow-md w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                    }}
                  />
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
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2 overflow-hidden">
                  <img 
                    src="/images/how-it-works/progress-tracking.png" 
                    alt="Progress tracking" 
                    className="rounded-lg shadow-md w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                    }}
                  />
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
                <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="max-w-full h-auto">
                  {/* Background */}
                  <rect width="800" height="600" fill="#f8fafc"/>
                  
                  {/* Title */}
                  <text x="400" y="40" fontFamily="Arial" fontSize="24" textAnchor="middle" fill="#1e293b">StartKaro System Architecture</text>
                  
                  {/* Frontend Layer */}
                  <rect x="50" y="80" width="700" height="120" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
                  <text x="400" y="110" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#1e293b">Frontend Layer</text>
                  
                  {/* Frontend Components */}
                  <rect x="100" y="130" width="150" height="50" rx="5" fill="#3b82f6" stroke="#2563eb" strokeWidth="2"/>
                  <text x="175" y="160" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">React + TypeScript</text>
                  
                  <rect x="300" y="130" width="150" height="50" rx="5" fill="#3b82f6" stroke="#2563eb" strokeWidth="2"/>
                  <text x="375" y="160" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">Tailwind CSS</text>
                  
                  <rect x="500" y="130" width="150" height="50" rx="5" fill="#3b82f6" stroke="#2563eb" strokeWidth="2"/>
                  <text x="575" y="160" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">shadcn/ui</text>
                  
                  {/* Backend Layer */}
                  <rect x="50" y="240" width="700" height="120" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
                  <text x="400" y="270" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#1e293b">Backend Layer</text>
                  
                  {/* Backend Components */}
                  <rect x="100" y="290" width="150" height="50" rx="5" fill="#10b981" stroke="#059669" strokeWidth="2"/>
                  <text x="175" y="320" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">Node.js + Express</text>
                  
                  <rect x="300" y="290" width="150" height="50" rx="5" fill="#10b981" stroke="#059669" strokeWidth="2"/>
                  <text x="375" y="320" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">MongoDB</text>
                  
                  <rect x="500" y="290" width="150" height="50" rx="5" fill="#10b981" stroke="#059669" strokeWidth="2"/>
                  <text x="575" y="320" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">Pinecone</text>
                  
                  {/* AI Layer */}
                  <rect x="50" y="400" width="700" height="120" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
                  <text x="400" y="430" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#1e293b">AI &amp; Processing Layer</text>
                  
                  {/* AI Components */}
                  <rect x="100" y="450" width="150" height="50" rx="5" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2"/>
                  <text x="175" y="480" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">OpenAI</text>
                  
                  <rect x="300" y="450" width="150" height="50" rx="5" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2"/>
                  <text x="375" y="480" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">OCR.space</text>
                  
                  <rect x="500" y="450" width="150" height="50" rx="5" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2"/>
                  <text x="575" y="480" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="white">Vector DB</text>
                  
                  {/* Connection Lines */}
                  {/* Frontend to Backend */}
                  <path d="M175 180 L175 290" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
                  <path d="M375 180 L375 290" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
                  <path d="M575 180 L575 290" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
                  
                  {/* Backend to AI */}
                  <path d="M175 340 L175 450" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
                  <path d="M375 340 L375 450" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
                  <path d="M575 340 L575 450" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
                  
                  {/* Legend */}
                  <rect x="50" y="550" width="700" height="40" rx="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1"/>
                  <text x="400" y="575" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="#64748b">
                      Frontend Layer (UI/UX) &gt; Backend Layer (Data Processing) &gt; AI Layer (Intelligence &amp; Analysis)
                  </text>
                </svg>
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
    </div>
  );
};

export default HowItWorks;
