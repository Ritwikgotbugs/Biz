import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight, 
  BarChart3, 
  Bell, 
  Calendar, 
  CheckCircle2, 
  CircleDot, 
  Clock,
  FileBarChart2, 
  Users
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import BusinessChecklist from "@/components/dashboard/BusinessChecklist";
import ComplianceReport from "@/components/dashboard/ComplianceReport";
import SectorDocuments from "@/components/knowledge-base/SectorDocuments";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

interface DashboardDatum {
  date: string;
  value: number;
}

interface DeadlineItem {
  title: string;
  dueDate: Date;
  description: string;
  type: "tax" | "compliance" | "legal";
  priority: "high" | "medium" | "low";
}

const dashboardData: {
  weeklyProgress: DashboardDatum[];
  monthlyProgress: DashboardDatum[];
  dailyProgress: DashboardDatum[];
} = {
  weeklyProgress: [
    { date: "Mon", value: 10 },
    { date: "Tue", value: 20 },
    { date: "Wed", value: 35 },
    { date: "Thu", value: 35 },
    { date: "Fri", value: 55 },
    { date: "Sat", value: 75 },
    { date: "Sun", value: 80 },
  ],
  monthlyProgress: [
    { date: "Week 1", value: 25 },
    { date: "Week 2", value: 45 },
    { date: "Week 3", value: 65 },
    { date: "Week 4", value: 80 },
  ],
  dailyProgress: [
    { date: "9AM", value: 5 },
    { date: "12PM", value: 15 },
    { date: "3PM", value: 30 },
    { date: "6PM", value: 45 },
    { date: "9PM", value: 60 },
  ],
};

// Upcoming deadlines data
const upcomingDeadlines: DeadlineItem[] = [
  { 
    title: "GST Return (GSTR-3B)",
    dueDate: addDays(new Date(), 8),
    description: "Monthly return for April 2024",
    type: "tax",
    priority: "high"
  },
  { 
    title: "Annual Compliance Report",
    dueDate: addDays(new Date(), 15),
    description: "Annual compliance filing deadline",
    type: "compliance",
    priority: "high"
  },
  { 
    title: "Employee Tax Submission",
    dueDate: addDays(new Date(), 22),
    description: "Quarterly employee tax forms",
    type: "tax",
    priority: "medium"
  },
  { 
    title: "Board Meeting Minutes",
    dueDate: addDays(new Date(), 30),
    description: "Document filing for Q1 meetings",
    type: "legal",
    priority: "low"
  }
];

const Dashboard = () => {
  const [progressValue, setProgressValue] = useState(30);
  const [nextDeadline, setNextDeadline] = useState<DeadlineItem | null>(null);
  const { user } = useAuth();
  
  const storedProfile = localStorage.getItem("userProfile");
  const userProfile = storedProfile ? JSON.parse(storedProfile) : {
    companyName: "TechVentures Pvt Ltd",
    incorporationDate: "2023-06-15",
    registrationState: "Karnataka",
    annualTurnover: "Under ₹40 lakhs",
    employeeCount: "5-10",
    sector: "Technology",
    businessType: "Private Limited Company"
  };
  
  const handleProgressChange = (value: number) => {
    setProgressValue(value);
  };

  useEffect(() => {
    // Sort deadlines by due date and find the closest upcoming deadline
    const sortedDeadlines = [...upcomingDeadlines].sort((a, b) => 
      a.dueDate.getTime() - b.dueDate.getTime()
    );
    
    if (sortedDeadlines.length > 0) {
      setNextDeadline(sortedDeadlines[0]);
    }
  }, []);

  // Calculate days remaining for a deadline
  const getDaysRemaining = (date: Date) => {
    const today = new Date();
    return differenceInDays(date, today);
  };

  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  // Get color based on deadline type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "tax": return "bg-blue-100 text-blue-700";
      case "compliance": return "bg-purple-100 text-purple-700";
      case "legal": return "bg-emerald-100 text-emerald-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.user_metadata?.name || user?.email || "User"}</p>
        </div>

        {/* Top row with Overall Progress, Next Deadline, and Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-100 to-indigo-50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-indigo-800">
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 p-1.5 rounded-md mr-2 text-white">
                  <CheckCircle2 className="h-5 w-5"/>
                </span>
                Overall Progress
              </CardTitle>
              <CardDescription className="text-indigo-600">
                Your startup journey completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-800">{progressValue}%</span>
                  <span className="text-xs text-indigo-500">Updated today</span>
                </div>
                <Progress value={progressValue} className="h-2 bg-gradient-to-r from-indigo-200 to-indigo-100" />
                <p className="text-xs text-indigo-500 mt-2">
                  {progressValue < 30 ? "Just getting started" : 
                   progressValue < 60 ? "Making good progress" : 
                   progressValue < 80 ? "Almost there" : "Nearly complete"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-100 to-amber-50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-amber-800">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-md mr-2 text-white">
                  <Calendar className="h-5 w-5"/>
                </span>
                Next Deadline
              </CardTitle>
              <CardDescription className="text-amber-600">
                Upcoming compliance date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nextDeadline ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-amber-500" />
                      <p className="font-medium text-amber-800">{nextDeadline.title}</p>
                    </div>
                    <Badge variant="outline" className={`${getPriorityColor(nextDeadline.priority)} bg-gradient-to-r from-amber-200 to-amber-100`}>
                      {nextDeadline.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-amber-600">Due on {format(nextDeadline.dueDate, "MMM dd, yyyy")}</p>
                    <Badge variant="outline" className={`${getTypeColor(nextDeadline.type)} bg-gradient-to-r from-amber-200 to-amber-100`}>
                      {nextDeadline.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-amber-800">{nextDeadline.description}</p>
                  <div className="flex items-center gap-1 text-sm mt-2 text-amber-600">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getDaysRemaining(nextDeadline.dueDate)} days remaining</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-20">
                  <p className="text-amber-600">No upcoming deadlines</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-100 to-blue-50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-blue-800">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1.5 rounded-md mr-2 text-white">
                  <Bell className="h-5 w-5"/>
                </span>
                Recent Activity
              </CardTitle>
              <CardDescription className="text-blue-600">
                Latest updates on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1 rounded-full mt-0.5 text-white">
                    <Bell className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Compliance report generated</p>
                    <p className="text-xs text-blue-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-full mt-0.5 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Checklist item completed</p>
                    <p className="text-xs text-blue-600">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-purple-500 to-violet-500 p-1 rounded-full mt-0.5 text-white">
                    <Users className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Team member invited</p>
                    <p className="text-xs text-blue-600">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Checklist - Full Width */}
        <div className="mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-rose-100 to-rose-50 border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-rose-800">
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 p-1.5 rounded-md mr-2 text-white">
                  <CheckCircle2 className="h-5 w-5"/>
                </span>
                Business Checklist
              </CardTitle>
              <CardDescription className="text-rose-600">
                Track your startup compliance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-rose-700">
              <BusinessChecklist onProgressChange={handleProgressChange} />
            </CardContent>
          </Card>
        </div>

        {/* Other Cards in a Grid Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-100 to-emerald-50 border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-emerald-800">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 rounded-md mr-2 text-white">
                  <FileBarChart2 className="h-5 w-5"/>
                </span>
                Sector Documents
              </CardTitle>
              <CardDescription className="text-emerald-600">
                Required documents for your business sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectorDocuments 
                sector={userProfile.sector}
                businessType={userProfile.businessType}
                userProfile={userProfile}
              />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-100 to-purple-50 border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-purple-800">
                <span className="bg-gradient-to-r from-purple-500 to-violet-500 p-1.5 rounded-md mr-2 text-white">
                  <FileBarChart2 className="h-5 w-5"/>
                </span>
                Compliance Report
              </CardTitle>
              <CardDescription className="text-purple-600">
                Your compliance status overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplianceReport 
                sectorType={userProfile.sector}
                businessType={userProfile.businessType}
                userProfile={userProfile}
              />
            </CardContent>
          </Card>
          
          {/* Progress Report Card - Hidden for now
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-100 to-blue-50 border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-blue-800">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1.5 rounded-md mr-2 text-white">
                  <BarChart3 className="h-5 w-5"/>
                </span>
                Progress Report
              </CardTitle>
              <CardDescription className="text-blue-600">
                Track your compliance progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weekly">
                <TabsList className="mb-4 bg-gradient-to-r from-blue-200 to-blue-100">
                  <TabsTrigger value="daily" className="text-blue-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-300 data-[state=active]:to-blue-200 data-[state=active]:text-blue-800 hover:bg-blue-300 hover:text-blue-900">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-blue-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-300 data-[state=active]:to-blue-200 data-[state=active]:text-blue-800 hover:bg-blue-300 hover:text-blue-900">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-blue-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-300 data-[state=active]:to-blue-200 data-[state=active]:text-blue-800 hover:bg-blue-300 hover:text-blue-900">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="space-y-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={dashboardData.dailyProgress} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#64748b" />
                      <YAxis hide={true} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Progress']}
                        contentStyle={{ 
                          borderRadius: '6px', 
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#1e293b'
                        }}
                      />
                      <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60a5fa" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-600">Today, {format(new Date(), 'MMM d, yyyy')}</span>
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>55% increase</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="weekly" className="space-y-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={dashboardData.weeklyProgress} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#64748b" />
                      <YAxis hide={true} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Progress']}
                        contentStyle={{ 
                          borderRadius: '6px', 
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#1e293b'
                        }}
                      />
                      <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60a5fa" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-600">Apr 8 - Apr 14, 2024</span>
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>45% increase</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="monthly" className="space-y-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={dashboardData.monthlyProgress} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#64748b" />
                      <YAxis hide={true} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Progress']}
                        contentStyle={{ 
                          borderRadius: '6px', 
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#1e293b'
                        }}
                      />
                      <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-600">Apr 1 - Apr 30, 2024</span>
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>55% increase</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          */}
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-100 to-amber-50 border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-amber-800">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-md mr-2 text-white">
                  <FileBarChart2 className="h-5 w-5"/>
                </span>
                Business Insights
              </CardTitle>
              <CardDescription className="text-amber-600">
                Based on your startup profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-amber-800">Startup India Recognition</h3>
                <p className="text-sm text-amber-600">
                  Your startup qualifies for DPIIT registration, which can provide tax benefits.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-amber-800">GST Threshold</h3>
                <p className="text-sm text-amber-600">
                  With turnover under ₹40 lakhs, GST registration is not mandatory for services in Karnataka.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-amber-800">Funding Eligibility</h3>
                <p className="text-sm text-amber-600">
                  Your tech startup may qualify for funding schemes like SIDBI Startup Fund.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
