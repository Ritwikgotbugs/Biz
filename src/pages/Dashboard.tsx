
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
import HeaderComponent from "@/components/layout/Header";
import FooterComponent from "@/components/layout/Footer";
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderComponent />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.name || user?.email || "User"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                  <CheckCircle2 className="h-5 w-5 text-primary"/>
                </span>
                Overall Progress
              </CardTitle>
              <CardDescription>
                Your startup journey completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{progressValue}%</span>
                  <span className="text-xs text-muted-foreground">Updated today</span>
                </div>
                <Progress value={progressValue} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {progressValue < 30 ? "Just getting started" : 
                   progressValue < 60 ? "Making good progress" : 
                   progressValue < 80 ? "Almost there" : "Nearly complete"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <span className="bg-amber-100 p-1.5 rounded-md mr-2">
                  <Calendar className="h-5 w-5 text-amber-500"/>
                </span>
                Next Deadline
              </CardTitle>
              <CardDescription>
                Upcoming compliance date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nextDeadline ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-amber-500" />
                      <p className="font-medium">{nextDeadline.title}</p>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(nextDeadline.priority)}>
                      {nextDeadline.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Due on {format(nextDeadline.dueDate, "MMM dd, yyyy")}</p>
                    <Badge variant="outline" className={getTypeColor(nextDeadline.type)}>
                      {nextDeadline.type}
                    </Badge>
                  </div>
                  <p className="text-sm">{nextDeadline.description}</p>
                  <div className="flex items-center gap-1 text-sm mt-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getDaysRemaining(nextDeadline.dueDate)} days remaining</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-20">
                  <p className="text-muted-foreground">No upcoming deadlines</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <span className="bg-blue-100 p-1.5 rounded-md mr-2">
                  <Bell className="h-5 w-5 text-blue-500"/>
                </span>
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <Bell className="h-3.5 w-3.5 text-blue-500" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Compliance report generated</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-green-100 p-1 rounded-full mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Checklist item completed</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-purple-100 p-1 rounded-full mt-0.5">
                    <Users className="h-3.5 w-3.5 text-purple-500" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Team member invited</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BusinessChecklist onProgressChange={handleProgressChange} />
            
            <SectorDocuments 
              sector={userProfile.sector}
              businessType={userProfile.businessType}
              userProfile={userProfile}
            />
          </div>
          
          <div className="space-y-6">
            <ComplianceReport 
              sectorType={userProfile.sector}
              businessType={userProfile.businessType}
              userProfile={userProfile}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Progress Report
                </CardTitle>
                <CardDescription>
                  Track your weekly compliance progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly">
                  <TabsList className="mb-4">
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="weekly" className="space-y-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={dashboardData.weeklyProgress} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis hide={true} />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Progress']}
                          contentStyle={{ borderRadius: '6px', border: '1px solid #e4e4e7' }}
                        />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Apr 8 - Apr 14, 2024</span>
                      <div className="flex items-center text-green-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>45% increase</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="monthly" className="space-y-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={dashboardData.monthlyProgress} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis hide={true} />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Progress']}
                          contentStyle={{ borderRadius: '6px', border: '1px solid #e4e4e7' }}
                        />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Apr 1 - Apr 30, 2024</span>
                      <div className="flex items-center text-green-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>55% increase</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileBarChart2 className="mr-2 h-5 w-5" />
                  Business Insights
                </CardTitle>
                <CardDescription>
                  Based on your startup profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Startup India Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Your startup qualifies for DPIIT registration, which can provide tax benefits.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">GST Threshold</h3>
                  <p className="text-sm text-muted-foreground">
                    With turnover under ₹40 lakhs, GST registration is not mandatory for services in Karnataka.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Funding Eligibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Your tech startup may qualify for funding schemes like SIDBI Startup Fund.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default Dashboard;
