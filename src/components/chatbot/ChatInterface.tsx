import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Paperclip, Bot, User, Image, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import LoadingDots from "@/components/ui/loading-dots";
import { Badge } from "@/components/ui/badge";

// Message type
interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
  timestamp: Date;
  attachments?: Attachment[];
}

// Attachment type
interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
}

// Mock data service for chat
const ChatService = {
  askQuestion: async (question: string, userUploads: any[]): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const q = question.toLowerCase();

  if (q.includes("document") || q.includes("missing") || q.includes("upload")) {
    return "Based on your uploaded documents, it appears you're missing your company PAN card and GST certificate. These are mandatory for tax filing and vendor onboarding.";
  }

  if (q.includes("gst") || q.includes("tax")) {
    return "Your startup must register for GST if your turnover exceeds ₹20 lakhs. For tech startups, the standard GST rate is 18%. Returns are filed monthly or quarterly using GSTR-1 and GSTR-3B forms.";
  }

  if (q.includes("funding") || q.includes("investor")) {
    return "To raise early-stage funding, prepare a solid pitch deck, financial projections (3-5 years), DPIIT certificate, shareholder agreement draft, and a proof of concept (PoC). Investors often ask for traction metrics and customer acquisition plans.";
  }

  if (q.includes("register") || q.includes("incorporation") || q.includes("mca")) {
    return "Company incorporation requires digital signatures (DSC), DINs for directors, a unique name via the RUN form, MOA and AOA drafts, and address proof for the registered office. The MCA usually processes this within 10-15 days.";
  }

  if (q.includes("startup india") || q.includes("dpiit")) {
    return "To register with Startup India and get DPIIT recognition, you'll need your incorporation certificate, company profile, business activities, and funding proof if any. DPIIT benefits include tax exemptions and funding access.";
  }
  

  if (q.includes("compliance") || q.includes("legal")) {
    return "As a private limited company, you must comply with annual RoC filings, hold annual general meetings, maintain board meeting minutes, file ITRs, and maintain statutory registers. Failing this may incur penalties.";
  }

  if (q.includes("hiring") || q.includes("employee") || q.includes("intern")) {
    return "For hiring employees, draft offer letters and NDAs. Register for EPFO and ESIC if you cross the employee threshold. For interns, offer a stipend and create a structured internship agreement outlining responsibilities.";
  }

  if (q.includes("ip") || q.includes("trademark") || q.includes("copyright")) {
    return "You can file trademarks via IP India's portal for your brand, logo, or product name. For software, you can register copyright. Filing patents requires novelty and technical specificity. Start early to avoid IP disputes.";
  }

  if (q.includes("bank account") || q.includes("open account")) {
    return "To open a business bank account, provide your incorporation certificate, PAN card, GST registration (if applicable), and board resolution authorizing the account. Choose a bank that supports digital banking and startup accounts.";
  }

  if (q.includes("roc") || q.includes("annual filing")) {
    return "RoC filings include Form AOC-4 (financial statements) and MGT-7 (annual return). These must be submitted within 30 and 60 days of the AGM, respectively. A CA or CS can assist with this process.";
  }

  if (q.includes("valuation") || q.includes("equity")) {
    return "Startup valuation is typically based on future earnings potential or market comparables. Use SAFE notes or convertible instruments for early-stage funding. Avoid diluting too much equity initially.";
  }

  if (q.includes("startup structure") || q.includes("entity type")) {
    return "Most startups register as Private Limited Companies due to easier fundraising and ESOP issuance. LLPs and OPCs are simpler but less investor-friendly. Choose based on your funding and liability needs.";
  }

  if (q.includes("msme")) {
    return "MSME registration provides credit facilitation, subsidies, and priority lending. You can apply on the Udyam Registration portal with your Aadhaar, PAN, and business details. Startups with turnover under ₹250 crore qualify.";
  }

  if (q.includes("start") || q.includes("open") || q.includes("launch")) {
    return "Before launching operations, you must complete key registrations like FSSAI, Eating House, and Shop & Establishment. All of these are currently pending for your business.";
  }
  
  if (q.includes("licenses") || q.includes("license")) {
    return "You're currently missing several important licenses including FSSAI, Fire Safety, Eating House, Liquor, and Health Trade licenses. These are especially crucial in the food sector.";
  }
  
  if (q.includes("pending") || q.includes("left") || q.includes("to do")) {
    return "Here's a summary of your pending compliances: FSSAI License, Health Trade License, GST Registration, Fire Safety License, Eating House License, Shop & Establishment Registration, Environmental Clearance, Trademark Registration, and more. Prioritize high-risk legal and safety items.";
  }
  
  if (q.includes("deadlines") || q.includes("date") || q.includes("by when")) {
    return "Your Income Tax Return is due by July 31, 2024. Monthly labor law filings and ongoing licenses like FSSAI should be handled as early as possible.";
  }
  
  if (q.includes("priority") || q.includes("urgent") || q.includes("important")) {
    return "High-priority items in your report include: FSSAI License, Fire Safety License, Health Trade License, and Eating House License. These should be addressed immediately to avoid penalties or shutdown.";
  }
  
  if (q.includes("how to get") || q.includes("apply") || q.includes("where to register")) {
    return "Each license or registration has its own portal or local office. For FSSAI, visit https://foscos.fssai.gov.in. GST registration can be done on https://www.gst.gov.in. For others like Health Trade or Eating House, consult local municipal authorities.";
  }
  
  if (q.includes("sole proprietorship") || q.includes("proprietor")) {
    return "Since your business is a Sole Proprietorship, you aren't required to file with the MCA, but must still obtain state-level registrations like GST, FSSAI, and labor licenses.";
  }
  
  if (q.includes("hiring") || q.includes("payroll") || q.includes("employee") || q.includes("hr")) {
    return "Ensure you're registered for Professional Tax and ESIC/EPFO if applicable. Offer proper offer letters, and follow labor laws like minimum wages and working hours. Labor law compliance is a monthly requirement.";
  }
  
  if (q.includes("monthly") || q.includes("routine")) {
    return "Labor law compliances need monthly filing. Additionally, hygiene checks and employee attendance records should be maintained regularly.";
  }
  
  
  if (q.includes("documents required") || q.includes("what do I need") || q.includes("required for registration")) {
    return "Commonly required documents include: PAN, Aadhaar, Address proof, Business utility bill, Passport photo, and MOA/AOA (if incorporated). FSSAI requires food safety plans and layout; GST needs bank details and PAN.";
  }
  
  if (q.includes("cost") || q.includes("fee") || q.includes("charge")) {
    return "Costs vary. GST is free to register. FSSAI may charge between ₹1000-5000 depending on business size. Legal help for licenses might cost ₹5000–₹25,000+.";
  }
  
  if (q.includes("fire") || q.includes("safety audit")) {
    return "The Fire Safety License is pending. You’ll need a site inspection, layout plan, fire extinguisher installation, and sometimes training. Consult your local fire department.";
  }
  
  if (q.includes("environmental") || q.includes("pollution") || q.includes("green")) {
    return "Environmental clearance is marked medium priority. If your kitchen discharges waste or uses heavy appliances, this may be mandatory. Apply through your state pollution control board.";
  }
  
  if (q.includes("weights") || q.includes("measurement")) {
    return "The Weights & Measures License is pending. This is required if you sell packaged food, use weighing scales, or dispense goods by volume.";
  }
  
  if (q.includes("branding") || q.includes("name") || q.includes("logo")) {
    return "Your Trademark registration is pending. This helps protect your brand and logo. You can apply through https://ipindia.gov.in or via a trademark agent.";
  }
  
  if (q.includes("status") || q.includes("report") || q.includes("summary")) {
    return "Your business 'BizAarambh' has 0 completed compliances. All critical registrations such as FSSAI, GST, and Health Trade License are pending. You must complete them before starting operations.";
  }
  
  if (q.includes("reminder") || q.includes("track")) {
    return "Set reminders for monthly labor filings and yearly income tax filing (due by July 31). Consider using compliance-tracking tools or consult a CA.";
  }

  if (q.includes("gst registration")) {
    return `🧾 The GST registration for BizAarambh is currently *pending*. It is categorized under *Tax* with a *high priority*, meaning it requires immediate attention. While there's no exact deadline, prompt registration avoids legal risk and ensures vendor compatibility.`;
  }

  if (q.includes("income tax")) {
    return `💰 Income Tax filing is *pending* for BizAarambh and is due by **July 31, 2024**. Filing on time is crucial to avoid penalties and maintain financial compliance.`;
  }

  if (q.includes("pending licenses") || q.includes("what is pending")) {
    return `📌 BizAarambh has the following *pending* compliance items:\n
- ✅ FSSAI License *(Legal – High Priority)*
- ✅ Health Trade License *(Legal – High Priority)*
- ✅ GST Registration *(Tax – High Priority)*
- ✅ Fire Safety License *(Safety – High Priority)*
- ✅ Eating House License *(Legal – High Priority)*
- ✅ Liquor License *(Legal – High Priority)*
- ✅ Shop & Establishment Act *(Legal – Medium Priority)*
- ✅ Environmental Clearance *(Environment – Medium Priority)*
- ✅ Professional Tax Registration *(Tax – Medium Priority)*
- ✅ Weights & Measures License *(Legal – Medium Priority)*\n
These should be prioritized based on urgency and operational risk.`;
  }

  if (q.includes("compliance recommendation") || q.includes("what should i do")) {
    return `🛠️ Here are top recommendations for BizAarambh's compliance:\n
- 🔺 Complete all pending high-priority registrations immediately.
- 📅 Set monthly/quarterly reminders for filings.
- 👨‍💼 Hire a Chartered Accountant (CA) to help with tax strategy and legal guidance.
- 🗂️ Keep all compliance documentation organized for audits.
- 🧼 Ensure hygiene audits and licenses (like FSSAI, Health Trade) are in place before opening.`;
  }
  if (q.includes("FSSAI") && q.includes("license")) {
    return `🍽️ The FSSAI License is currently *pending* for BizAarambh. It is crucial for ensuring food safety compliance, protecting consumer health, and allowing your business to operate legally in the food sector.`;
    }
    
    if (q.includes("fire safety") && q.includes("license")) {
    return `🔥 The Fire Safety License is *pending* for BizAarambh. Obtaining this license is vital to comply with safety regulations and to mitigate risks related to fire hazards in your operations.`;
    }
    
    if (q.includes("liquor") && q.includes("license")) {
    return `🍺 The Liquor License is currently *pending* for BizAarambh. This license is crucial for legal compliance if your business intends to serve or sell alcoholic beverages.`;
    }
    
    if (q.includes("labour") && q.includes("compliance")) {
    return `👥 Labour compliance is *pending* for BizAarambh. It is essential to meet legal obligations regarding employee rights and working conditions, ensuring a conducive work environment.`;
    }
    
    if (q.includes("GST") && q.includes("registration")) {
    return `📜 GST Registration is *pending* for BizAarambh. This is a key requirement for tax compliance in your business operations, allowing you to charge GST on sales and claim input tax credits.`;
    }
    
    if (q.includes("environmental") && q.includes("clearance")) {
    return `🌍 Environmental Clearance is *pending* for BizAarambh. This is necessary to obtain approval for operations that may affect the environment, ensuring compliance with regulatory standards.`;
    }
    
    if (q.includes("trademark") && q.includes("registration")) {
    return `™ Trademark Registration is *pending* for BizAarambh. Securing a trademark helps protect your brand identity and prevents others from using a similar name or logo in the market.`;
    }
    
    if (q.includes("income tax") && q.includes("filing")) {
    return `💰 Income Tax Filing is *pending* for BizAarambh, with a deadline set for July 31, 2024. Timely filing is crucial to avoid penalties and maintain compliance with tax regulations.`;
    }

    if (q.includes("shop") && q.includes("establishment")) {
      return `🏬 The Shop & Establishment registration is *pending* for BizAarambh. It’s a *legal requirement* before starting operations. It ensures your business complies with local labor laws like employee working hours, holidays, etc.`;
    }
    if (q.includes("recommendations") || q.includes("suggestions")) {
      return `📋 Here are some key recommendations for BizAarambh:
      1. Ensure you have *complete compliance* with all mandatory registrations.
      2. Set up *automatic reminders* for critical filing deadlines to avoid penalties.
      3. Consult a *Chartered Accountant (CA)* regularly to optimize tax benefits and manage finances.
      4. Keep your *business documentation* organized and updated for smooth audits and renewals.`;
    }
    
    if (q.includes("annual turnover") || q.includes("revenue")) {
      return `💵 BizAarambh has an annual turnover of *under 40 lakhs*. This means your business may qualify for tax exemptions and simplified compliance, but you still need to ensure adherence to essential legal and tax obligations.`;
    }
    
    if (q.includes("business type") || q.includes("company type") || q.includes("registration type")) {
      return `🏢 BizAarambh is registered as a *Sole Proprietorship*. This business structure offers complete control to the owner but also personal liability for its debts. Ensure to stay on top of regulatory compliance for sole proprietorships.`;
    }
    
    if (q.includes("state of registration") || q.includes("business location")) {
      return `🗺️ BizAarambh is officially registered in *Delhi*. Make sure to comply with local laws specific to Delhi, including food safety, labor regulations, and business operations.`;
    }
    
    if (q.includes("incorporation date") || q.includes("start date") || q.includes("business start")) {
      return `📅 BizAarambh was incorporated on *April 13, 2025*. This marks your legal establishment, and compliance with statutory filings starts from this date.`;
    }
    
    if (q.includes("sole proprietorship") || q.includes("individual business")) {
      return `🏢 As a *sole proprietorship*, you have complete control over the business operations, but are personally liable for its debts. It's cost-effective but comes with a higher personal risk.`;
    }
    
    if (q.includes("annual turnover significance") || q.includes("impact of turnover") || q.includes("turnover effect")) {
      return `💵 A turnover under *40 lakhs* means you may qualify for GST exemptions and simplified tax filings, but still need to follow all applicable compliance norms and maintain financial transparency.`;
    }
    
    if (q.includes("pending compliance") || q.includes("pending registrations") || q.includes("unresolved compliance")) {
      return `📝 BizAarambh has several *pending compliance tasks* that include:
      - **GST Registration**: Pending
      - **Income Tax Filing**: Pending (Deadline: July 31, 2024)
      - **Trademark Registration**: Pending
      - **Labour Compliances**: Monthly compliance due
      - **Shop & Establishment Registration**: Pending (before operations start)`;
    }
    
    if (q.includes("importance of gst registration") || q.includes("why gst is important")) {
      return `🔍 *GST Registration* is essential for legitimate tax operations. It enables your business to charge taxes on sales, file returns, and claim credits on tax paid for purchases, ensuring smooth operations.`;
    }
    
    if (q.includes("FSSAI License process") || q.includes("FSSAI procedure") || q.includes("how to get FSSAI")) {
      return `🥗 To obtain an *FSSAI License*, you need to:
      1. Submit an application with your business details, food safety plan, and required documentation.
      2. Undergo a site inspection (if applicable).
      3. Pay fees based on your business scale.
      This is a *high-priority* task to start immediately.`;
    }
    
    if (q.includes("labour compliance implications") || q.includes("labour laws consequences") || q.includes("why labour compliance")) {
      return `⚖️ Labour compliance ensures the welfare of employees (e.g., wages, hours, leaves). Non-compliance could result in severe penalties, damage to business reputation, and legal consequences.`;
    }
    
    if (q.includes("fire safety license steps") || q.includes("how to get fire safety license")) {
      return `🔥 To secure a *Fire Safety License*, you’ll need to:
      1. Complete a fire safety audit.
      2. Fulfill all equipment and safety code requirements.
      3. Submit necessary applications and documentation to the local authorities.
      Failing to secure this can result in penalties and operational shutdowns.`;
    }
    
    if (q.includes("shop & establishment act") || q.includes("shop act registration") || q.includes("shop act details")) {
      return `🏢 The *Shop & Establishment Act* regulates business operations and employee rights. Registering under this act ensures your business complies with local labor laws and avoids penalties.`;
    }
    
    if (q.includes("compliance deadlines") || q.includes("upcoming deadlines") || q.includes("important dates")) {
      return `⏳ Key upcoming *compliance deadlines* include:
      - **Income Tax Filing**: July 31, 2024
      Stay on top of these dates to avoid penalties.`;
    }
    
    if (q.includes("penalty for missing tax deadlines") || q.includes("consequences of missing tax filing") || q.includes("tax filing penalty")) {
      return `⚠️ Missing the income tax filing deadline could result in fines, higher tax liabilities, and interest on overdue amounts. It’s crucial to file on time to avoid these consequences.`;
    }
    
    if (q.includes("setting reminders for deadlines") || q.includes("how to track deadlines")) {
      return `📅 Set *automatic reminders* using digital tools such as task management apps, calendars, or compliance management software to stay ahead of critical filing dates.`;
    }
    
    if (q.includes("steps to complete registrations") || q.includes("how to register business") || q.includes("starting registration process")) {
      return `🗂️ Begin your registration process by prioritizing the most urgent tasks such as FSSAI and GST registrations. Complete each registration step by step, and ensure proper documentation for each.`;
    }
    
    if (q.includes("chartered accountant assistance") || q.includes("tax planning CA") || q.includes("CA role")) {
      return `💼 A *Chartered Accountant (CA)* can assist in tax optimization, financial planning, and ensuring your business meets all compliance standards. Engage them for strategic advice.`;
    }
    
    if (q.includes("documentation for compliance") || q.includes("what documents are needed") || q.includes("compliance record keeping")) {
      return `🗃️ Maintain thorough *documentation* of all registrations, tax filings, compliance certificates, and any inspections to ensure you’re ready for audits and renewals.`;
    }
    
    if (q.includes("liquor license process") || q.includes("how to obtain liquor license") || q.includes("liquor license steps")) {
      return `🍹 To get a *Liquor License*, you need to:
      1. Submit an application to the excise department.
      2. Provide documents like your lease deed, ID, and company papers.
      3. Go through an interview and verification process.
      4. Make fee payments and wait for approval.
      Starting this process early is crucial as it can take time.`;
    }
    
    if (q.includes("environmental clearance consequences") || q.includes("environmental laws impact") || q.includes("why environmental clearance")) {
      return `🌍 Without *Environmental Clearance*, your business may face penalties, legal actions, and even shutdowns, particularly if your operations discharge waste or impact the environment.`;
    }
    
    if (q.includes("weights & measures license") || q.includes("measurement compliance") || q.includes("weights & measures")) {
      return `⚖️ To maintain *Weights & Measures compliance*, ensure that your measuring instruments are calibrated regularly and adhere to local regulations for accuracy in measurement.`;
    }
    
    if (q.includes("Delhi-specific compliance") || q.includes("Delhi regulations") || q.includes("compliance in Delhi")) {
      return `🗺️ Delhi has specific regulations for food safety, employee rights, and environmental protections. Stay updated with these to avoid penalties and ensure smooth operations.`;
    }
    
    if (q.includes("maintain compliance") || q.includes("how to stay compliant") || q.includes("compliance maintenance")) {
      return `📚 To ensure compliance:
      - Conduct *internal audits* regularly.
      - Use *reminder tools* for deadlines.
      - Train your staff on their rights and responsibilities.
      - Keep comprehensive records of all registrations and renewals.
      This will ensure you’re always audit-ready.`;
    }
    

    if (["hi", "hello", "hey"].some(greet => q.includes(greet))) {
      return "Hey there! 👋 I'm your startup compliance assistant. Ask me anything about business licenses, legal filings, or how to get your startup compliant.";
    }
    
    if (q.includes("who are you") || q.includes("what do you do") || q.includes("chatbot")) {
      return "I'm BizBot 🤖 — your AI-powered assistant helping startups like BizAarambh with licensing, registration, and compliance. Upload your documents or ask about GST, FSSAI, ITR, and more!";
    }
    
    if (q.includes("how to start") || q.includes("open a startup") || q.includes("starting a business")) {
      return `Great question! 🚀 To start a business in India:\n
    1. Choose your business type (e.g., Proprietorship, LLP, Pvt Ltd)\n
    2. Get required documents (PAN, Aadhaar, Address proof)\n
    3. Register the company (MCA or local authority)\n
    4. Apply for licenses (GST, FSSAI, Shop & Establishment, etc.)\n
    5. Open a business bank account\n
    6. Keep track of compliance (tax, labor laws, filings)\n
    Let me know your sector, and I can list exact requirements.`;
    }
    
    if (q.includes("what are licenses") || q.includes("business licenses") || q.includes("license meaning")) {
      return `📜 Business licenses are legal permissions from government bodies allowing you to operate legally. For a food startup like yours, this includes:\n
    - 🥗 FSSAI License (Food safety)\n
    - 🧯 Fire Safety Certificate\n
    - 🏬 Shop & Establishment Registration\n
    - 🍴 Eating House License\n
    - 💼 GST Registration (for taxation)\n
    Each license protects consumers, ensures safety, and allows smooth business operations.`;
    }
    
    if (q.includes("help") || q.includes("assist") || q.includes("guide")) {
      return `Of course! 🙌 I can help you with:\n
    - Checking pending licenses from your document\n
    - Explaining compliance processes (like FSSAI, GST, ITR)\n
    - Giving deadlines and priority levels\n
    - Offering recommendations to get fully compliant\n
    Just ask a question or upload your compliance report!`;
    }
  
  if (q.includes("thanks") || q.includes("thank you")) {
    return "You're welcome! 😊 Always here to help you navigate startup compliance like a pro.";
  }

  if (q.includes("what can you do") || q.includes("how can you help")) {
    return "I help you understand, track, and complete legal compliances like GST, FSSAI, Fire Safety, ITR, etc.";
  }
  
  // 4. How to start a business
  if (q.includes("how do i start") || q.includes("starting a company") || q.includes("open my startup")) {
    return "Start by choosing your entity type, getting key documents like PAN/Aadhaar, and applying for licenses like GST, FSSAI, and others.";
  }
  
  // 5. Why do I need FSSAI?
  if (q.includes("why fssai") || q.includes("need fssai")) {
    return "FSSAI ensures your food is safe and hygienic. Without it, you're not legally allowed to run a food business in India.";
  }
  
  // 6. Why GST?
  if (q.includes("why gst") || q.includes("is gst mandatory")) {
    return "GST is needed to comply with Indian tax laws, claim input credit, and sell legally if your turnover exceeds ₹20 lakhs.";
  }
  
  // 7. Why Fire Safety?
  if (q.includes("why fire safety")) {
    return "It's a legal requirement for public spaces and kitchens. It prevents disasters and shows your business is safety-compliant.";
  }
  
  // 8. Why Health Trade License?
  if (q.includes("why health trade")) {
    return "It ensures your premises meet health and hygiene standards. It's mandatory before operating in the food and health sector.";
  }
  
  // 9. Why Eating House License?
  if (q.includes("why eating house")) {
    return "Required for places where food is served to the public. It gives you permission from the Police Commissioner’s office.";
  }
  
  // 10. Why Liquor License?
  if (q.includes("why liquor license")) {
    return "If you plan to serve alcohol, it's a must-have. Operating without it can lead to heavy fines or shutdown.";
  }
  if (q.includes("why shop establishment")) {
    return "This governs working hours, holidays, and staff welfare. It’s compulsory for all shops and establishments, even if you're a sole proprietor.";
  }
  
  // 11. Why trademark?
  if (q.includes("why trademark") || q.includes("why brand registration")) {
    return "It protects your brand legally and prevents others from copying your name or logo.";
  }
  if (q.includes("why weights") || q.includes("why measurement license")) {
    return "If you sell products based on weight or quantity, this ensures your measurements are accurate and legally approved.";
  }
  
  // 12. Do I need all these licenses?
  if (q.includes("do i need all") || q.includes("are all licenses required")) {
    return "Yes, based on your industry and location, many licenses are legally required. Each serves a different regulatory purpose.";
  }
  if (q.includes("which licenses are important")) {
    return "High priority for you: FSSAI, GST, Eating House, Fire Safety, and Health Trade. These are critical for operation and safety.";
  }
  
  // 13. What happens if I delay?
  if (q.includes("what if i delay") || q.includes("penalty") || q.includes("consequence")) {
    return "Delays can lead to fines, inability to operate, legal notices, or even shutdown orders. Prioritize compliance.";
  }
  if (q.includes("what are the fines") || q.includes("what is the risk")) {
    return "Penalties vary from ₹5,000 to ₹1 lakh+ depending on the license. Plus, operational bans and brand reputation damage.";
  }
  // 14. Deadlines-related
  if (q.includes("when is due") || q.includes("deadline") || q.includes("last date")) {
    return "The Income Tax Return is due by July 31, 2024. Other registrations should be completed before launching your business.";
  }
  // 15. How long does it take
  if (q.includes("how long") || q.includes("turnaround")) {
    return "It depends. FSSAI takes 7–15 days. GST in ~3–7 days. Fire Safety and Eating House can take a few weeks post inspection.";
  }
  // 16. Where do I apply?
  if (q.includes("where to apply") || q.includes("how to get license")) {
    return "Most applications are online: GST (gst.gov.in), FSSAI (foscos.fssai.gov.in), Trademark (ipindia.gov.in). For local licenses, use municipal portals.";
  }
  // 17. What documents do I need?
  if (q.includes("documents needed") || q.includes("what do i need")) {
    return "Common documents: PAN, Aadhaar, address proof, food safety plan, photographs, utility bill, NOC (if renting).";
  }
  // 18. Is there a checklist?
  if (q.includes("checklist") || q.includes("step by step")) {
    return "Sure! Let me know your business type (e.g. food, retail), and I’ll give you a full checklist of what’s required.";
  }
  // 19. What type of business should I register?
  if (q.includes("llp") || q.includes("pvt") || q.includes("proprietorship")) {
    return "Pvt Ltd is great for funding & ESOPs, LLP is good for partnerships, and Proprietorship is easy to start. Let me know your goals, I can recommend.";
  }
  // 20. What is MSME?
  if (q.includes("what is msme") || q.includes("should i register for msme")) {
    return "MSME registration offers benefits like subsidies, loan access, and priority government contracts. Apply at udyamregistration.gov.in.";
  }
  // 21. What is DPIIT?
  if (q.includes("dpiit") || q.includes("startup india")) {
  return "DPIIT recognition under Startup India offers tax breaks, funding access, and benefits for eligible startups.";
  }
  // 22. What are labor laws?
  if (q.includes("labor law") || q.includes("employee law")) {
    return "Labor laws include minimum wage, EPF/ESIC, working hours, and contract enforcement. Regular compliance is mandatory.";
  }
  // 23. What is an ITR?
  if (q.includes("what is itr") || q.includes("income tax return")) {
    return "ITR stands for Income Tax Return — it reports your income and taxes. It must be filed yearly. Due: July 31 for individuals.";
  }
  // 24. Can I run without a license?
  if (q.includes("can i start") && q.includes("without license")) {
    return "Technically no. Operating without licenses can attract heavy penalties and even closure by authorities.";
  }
  // 25. Who can help me?
  if (q.includes("who can help") || q.includes("need help")) {
    return "I recommend hiring a CA or legal advisor for filings. I can also guide you through most processes if you tell me what you’re working on.";
  }
  // 26. Can I do it myself?
  if (q.includes("can i do myself") || q.includes("do i need an agent")) {
    return "Yes! Many registrations like GST, MSME, and Trademark can be self-filed. I can give you links and steps.";
  }
  // 27. What is RoC filing?
  if (q.includes("roc filing") || q.includes("mgt-7") || q.includes("aoc-4")) {
    return "RoC filings are for Pvt Ltd/LLP companies. You must file annual financials (AOC-4) and annual return (MGT-7) with the Ministry of Corporate Affairs.";
  }
  // 28. What is an FBO?
  if (q.includes("fbo")) {
    return "FBO means Food Business Operator. Any business involved in food must register as an FBO under FSSAI.";
  }
  // 29. What is EIA?
  if (q.includes("eia") || q.includes("environment impact")) {
    return "EIA stands for Environmental Impact Assessment. It’s needed to understand how your operations affect the environment before applying for clearance.";
  }
  // 30. What is EPFO or ESIC?
  if (q.includes("epfo") || q.includes("esic")) {
    return "These are social security schemes for employees. If you hire over 10 people, registration is mandatory under labor laws.";
  }
  // 31. Do I need CA or lawyer?
  if (q.includes("do i need ca") || q.includes("do i need lawyer")) {
    return "It’s not mandatory, but highly recommended. A CA helps with taxes and ITRs. A lawyer helps with contracts and IP.";
  }
  // 32. Should I trademark my name?
  if (q.includes("trademark my business") || q.includes("protect my brand")) {
    return "Yes, trademarking protects your identity legally. It prevents others from copying your name/logo. File it early!";
  }
  // 33. How much does it cost?
  if (q.includes("cost") || q.includes("fee")) {
    return "Cost depends: GST – free, FSSAI – ₹1000–5000, Trademark – ₹4500+, CA/legal fees – variable. I can help estimate for your startup.";
  }
  // 34. Can I operate from home?
  if (q.includes("home") || q.includes("business from home")) {
    return "Yes, many licenses support home kitchens or service-based startups. But FSSAI and Shop Act registration still apply in most cases.";
  }
  // 35. Where is my business located?
  if (q.includes("my state") || q.includes("location based")) {
    return "Your compliance needs depend on your registered state. You're registered in **Delhi**, so Delhi municipal and state rules apply.";
  }
  // 36. Why is FSSAI high priority?
  if (q.includes("why high priority") && q.includes("fssai")) {
    return "Because without it, your food business can't legally operate. It's critical for consumer health and brand trust.";
  }
  // 37. Why is labor monthly?
  if (q.includes("why monthly") && q.includes("labour")) {
    return "Labor filings are required monthly for wages, attendance, and PF/ESIC deductions. Missing them can lead to audits.";
  }
  // 38. How do I update my licenses?
  if (q.includes("update license") || q.includes("renew")) {
    return "Many licenses like FSSAI or Shop Act need periodic renewal. Visit the portal you applied on and submit updated documents.";
  }
  // 39. Can I check license status?
  if (q.includes("license status")) {
    return "Yes, most portals (e.g., FSSAI, GST) allow you to check status using your application/reference number.";
  }
  // 40. What is BizAarambh's status?
  if (q.includes("biza") || q.includes("my status")) {
    return "You currently have **0 completed items** and multiple pending licenses. I can walk you through what to prioritize.";
  }
  // 41. Can I skip any licenses?
  if (q.includes("can i skip")) {
    return "Skipping may lead to penalties or shutdown. If you’re unsure, tell me what you're selling or offering, and I’ll confirm what's mandatory.";
  }
  // 42. Do I need Pollution Control NOC?
  if (q.includes("pollution control")) {
    return "If you use exhaust, water discharge, or generators, you'll likely need clearance from the State Pollution Control Board.";
  }
  // 43. Do I need professional tax?
  if (q.includes("professional tax")) {
    return "Yes, even sole proprietors may need it depending on the state and whether you have employees. It's pending for you.";
  }
  // 44. Why should I register now?
  if (q.includes("why register now") || q.includes("urgency")) {
    return "Early registration avoids delays, penalties, and gives your startup legal credibility. Many applications take weeks — better to start early.";
  }
  // 45. Is FSSAI mandatory for small business?
  if (q.includes("fssai") && q.includes("small business")) {
    return "Yes, even home kitchens and online food sellers need it. There’s a basic registration for businesses under ₹12 lakhs turnover.";
  }
  // 46. Can I sell online without licenses?
  if (q.includes("sell online")) {
    return "If you're selling food or services, you’ll still need licenses like FSSAI, GST, and possibly Shop & Establishment. Platforms may ask for proof.";
  }
  // 47. Are these for Delhi only?
  if (q.includes("delhi") || q.includes("state")) {
    return "While central licenses like GST & FSSAI apply nationwide, state-level ones like Trade or Fire Safety vary by city/state. Yours is Delhi-specific.";
  }
  // 48. Will this work for food trucks?
  if (q.includes("food truck")) {
    return "Yes, food trucks need FSSAI, Trade License, Fire Safety, and NOC from RTO/traffic authorities. Let me know your vehicle type.";
  }
  // 49. Can I apply for multiple at once?
  if (q.includes("multiple licenses") || q.includes("apply together")) {
    return "Some licenses can be applied in parallel (e.g., FSSAI + GST). Others need prior approvals. I’ll guide you step-by-step.";
  }
  // 50. Can I get reminders?
  if (q.includes("reminder") || q.includes("track deadlines")) {
    return "Set reminders for Income Tax (July 31), labor filings (monthly), and license renewals. I can send you a checklist too!";
  }

  if (q.includes("health trade license") || q.includes("apply health license")) {
    return "You can apply for a health trade license from your local municipal corporation or health department. You'll need to submit a hygiene and sanitary compliance report.";
  }
  
  // 3. Is an FSSAI license required for selling packaged food?
  if (q.includes("packaged food") || q.includes("sell packaged food")) {
    return "Yes, an FSSAI license is mandatory for businesses selling packaged food, whether online or offline. The license ensures food safety standards are met.";
  }
  
  // 4. How do I get a NOC from the fire department?
  if (q.includes("fire NOC") || q.includes("fire safety NOC")) {
    return "To get a fire NOC, you must apply to the local fire department. They will inspect your premises to ensure it meets fire safety standards. Documentation and payment of fees are required.";
  }
  
  // 5. What is the difference between a trade license and a food license?
  if (q.includes("trade license") && q.includes("food license")) {
    return "A trade license is a general license to run any business, while a food license (FSSAI) is specifically for food safety. You need both to run a food business legally.";
  }
  
  // 6. Can I apply for FSSAI after opening my restaurant?
  if (q.includes("apply for FSSAI") && q.includes("after opening restaurant")) {
    return "Yes, you can apply for FSSAI even after opening your restaurant, but you should do so as soon as possible to avoid fines or closure.";
  }
  
  // 7. Is GST mandatory for food businesses?
  if (q.includes("GST") || q.includes("is GST mandatory")) {
    return "GST registration is mandatory for food businesses with an annual turnover of over ₹40 lakh (₹20 lakh for special category states).";
  }
  
  // 8. What documents are required for GST registration?
  if (q.includes("GST registration") || q.includes("documents for GST")) {
    return "You'll need your business PAN card, Aadhaar card, address proof, bank account details, and partnership deed (if applicable) for GST registration.";
  }
  
  // 9. Can I operate a food business from home?
  if (q.includes("food business") && q.includes("from home")) {
    return "Yes, you can operate a food business from home, but you still need licenses like FSSAI, a trade license, and may need a health license depending on your business model.";
  }
  
  // 10. What are the penalties for operating without a license?
  if (q.includes("penalty") && q.includes("no license")) {
    return "Operating without a license can result in heavy fines, legal action, and even closure of your business. It's important to comply with all legal requirements.";
  }
  
  // 11. How long does it take to get a trade license?
  if (q.includes("trade license") && q.includes("time") || q.includes("how long")) {
    return "The time taken to get a trade license can vary by state, but it typically takes around 7-30 days after submitting your application.";
  }
  
  // 12. What is the procedure to apply for a fire safety certificate?
  if (q.includes("fire safety certificate") || q.includes("apply fire safety")) {
    return "To apply for a fire safety certificate, you must submit an application to your local fire department. The authorities will inspect your premises and issue the certificate if all standards are met.";
  }
  
  // 13. Do I need a license for selling street food?
  if (q.includes("street food") || q.includes("selling street food")) {
    return "Yes, you need an FSSAI license, a trade license, and in some cases, a health trade license for selling street food. Local authorities may also require an inspection.";
  }
  
  // 14. Can I apply for multiple licenses at the same time?
  if (q.includes("multiple licenses") || q.includes("apply together")) {
    return "Yes, some licenses like FSSAI and GST can be applied simultaneously, while others may require you to apply in sequence.";
  }
  
  // 15. Is there a specific license for home-based food businesses?
  if (q.includes("home-based food business") || q.includes("home food license")) {
    return "For home-based food businesses, you’ll still need an FSSAI license, along with a trade license and possibly a health trade license, depending on your location.";
  }
  
  // 16. How do I apply for an FSSAI registration?
  if (q.includes("apply FSSAI") || q.includes("FSSAI registration")) {
    return "You can apply for an FSSAI registration through their online portal by filling out the necessary forms and submitting required documents such as your address proof, ID proof, and business details.";
  }
  
  // 17. How do I apply for an FSSAI license renewal?
  if (q.includes("renew FSSAI") || q.includes("FSSAI renewal")) {
    return "You can renew your FSSAI license online on the FSSAI portal. You need to submit the renewal application 30 days before the expiration of your current license.";
  }
  
  // 18. Do I need a NOC from the local municipal corporation?
  if (q.includes("NOC from municipal corporation") || q.includes("apply NOC")) {
    return "Yes, in some areas, you may need to obtain a No Objection Certificate (NOC) from the local municipal corporation to operate a food business.";
  }
  
  // 19. Can I operate without a license if I am just selling food online?
  if (q.includes("selling food online") || q.includes("online food business")) {
    return "No, an FSSAI license is mandatory even for online food businesses. You must also comply with other licensing requirements depending on your business model.";
  }
  
  // 20. What licenses do I need for a food delivery business?
  if (q.includes("food delivery") || q.includes("licenses for food delivery")) {
    return "For a food delivery business, you need an FSSAI license, GST registration, and possibly a trade license, along with a health trade license depending on the state.";
  }
  
  // 21. Can I get an FSSAI license without a physical store?
  if (q.includes("physical store") && q.includes("FSSAI license")) {
    return "Yes, you can get an FSSAI license even if you don’t have a physical store, as long as you are selling food and complying with food safety regulations.";
  }
  
  // 22. What is an FSSAI food safety audit?
  if (q.includes("FSSAI audit") || q.includes("food safety audit")) {
    return "An FSSAI food safety audit is an inspection conducted by the FSSAI to ensure that your food establishment follows all food safety protocols. It is required for obtaining and renewing your FSSAI license.";
  }
  
  // 23. What licenses do I need for a catering business?
  if (q.includes("catering business") || q.includes("licenses for catering")) {
    return "A catering business requires an FSSAI license, a trade license, a fire safety certificate, and a health trade license.";
  }
  
  // 24. How can I get a GST exemption for my food business?
  if (q.includes("GST exemption") || q.includes("GST exempt")) {
    return "Small food businesses with an annual turnover below ₹40 lakh (₹20 lakh for special category states) are exempt from GST registration, though it's recommended to still register for easier tax management.";
  }
  
  // 25. Do I need to get a pollution control license for my food business?
  if (q.includes("pollution control license") || q.includes("pollution control")) {
    return "If your food business produces significant waste or emissions, you may need a pollution control license from the local authorities, especially for manufacturing units.";
  }
  
  // 26. Can I run a food business without a fire safety certificate?
  if (q.includes("fire safety certificate") || q.includes("run food business without fire safety")) {
    return "No, a fire safety certificate is mandatory for most food businesses, especially those with a kitchen, as it ensures safety and compliance with fire regulations.";
  }
  
  // 27. What is an FSSAI registration vs FSSAI license?
  if (q.includes("FSSAI registration") && q.includes("FSSAI license")) {
    return "FSSAI registration is for small food businesses with lower risk, while an FSSAI license is required for larger businesses. Both ensure compliance with food safety standards.";
  }
  
  // 28. What is the validity of an FSSAI license?
  if (q.includes("validity of FSSAI license") || q.includes("how long is FSSAI valid")) {
    return "An FSSAI license is typically valid for 1-5 years, depending on the type of license issued. You must renew it before it expires.";
  }
  
  // 29. How much does a fire safety certificate cost?
  if (q.includes("fire safety certificate") || q.includes("cost of fire safety certificate")) {
    return "The cost of a fire safety certificate varies by location and business size, but it generally ranges from ₹2,000 to ₹10,000.";
  }

  if (q.includes("process for FSSAI") || q.includes("how to get FSSAI license")) {
    return "To obtain an FSSAI license, you must fill out an application on the FSSAI website, submit required documents (like ID proof, business details, and address proof), and undergo an inspection. Depending on the size of your business, you may apply for a registration or a license.";
  }
  
  // 32. Can I apply for a food business license online?
  if (q.includes("apply online") && q.includes("food business license")) {
    return "Yes, you can apply for food business licenses like FSSAI and GST online through their respective portals. Ensure you have all required documents like proof of address, business PAN, and a detailed description of your operations.";
  }
  
  // 33. What is the difference between an FSSAI registration and license?
  if (q.includes("FSSAI registration") && q.includes("difference")) {
    return "FSSAI registration is for small-scale businesses, like home-based food producers, while FSSAI license is for larger-scale food businesses that manufacture, process, or distribute food.";
  }
  
  // 34. How do I get a GST registration for my food business?
  if (q.includes("GST registration") || q.includes("apply GST for food business")) {
    return "To get a GST registration, visit the GST portal, create an account, and submit the necessary documents, including your PAN, address proof, and business details. The registration process can take up to 15 days.";
  }
  
  // 35. What is the role of a food safety officer in FSSAI inspections?
  if (q.includes("food safety officer") || q.includes("FSSAI inspection")) {
    return "A food safety officer (FSO) conducts inspections of your food business premises to ensure compliance with food safety standards. They check hygiene, food handling practices, storage, and the overall quality of food being served or sold.";
  }
  
  // 36. What is a no-objection certificate (NOC)?
  if (q.includes("no-objection certificate") || q.includes("NOC")) {
    return "A No-Objection Certificate (NOC) is required for various activities, including opening a food business. It is issued by local authorities to confirm there are no objections to your business operations at a given location.";
  }
  
  // 37. Can I operate a food business without a health trade license?
  if (q.includes("health trade license") || q.includes("without health trade license")) {
    return "No, most states require a health trade license to ensure that your food business adheres to sanitary and health safety standards. It's a crucial part of operating a legitimate food business.";
  }
  
  // 38. What licenses do I need to start a food delivery app business?
  if (q.includes("food delivery app") || q.includes("food delivery business")) {
    return "For a food delivery app business, you will need an FSSAI license for food safety, a GST registration, a trade license, and possibly a health trade license depending on your location and business model.";
  }
  
  // 39. How can I apply for a trade license for my restaurant?
  if (q.includes("restaurant trade license") || q.includes("apply for trade license")) {
    return "You can apply for a trade license at your local municipal corporation. The application requires your business address, ID proof, and an inspection of your premises to ensure it meets safety standards.";
  }
  
  // 40. What are the requirements for food business documentation?
  if (q.includes("food business documentation") || q.includes("documents for food business")) {
    return "To register your food business, you typically need a PAN card, Aadhaar card, business address proof, partnership deed (if applicable), bank account details, and proof of food safety practices.";
  }
  
  // 41. Do I need a license for operating a food processing unit?
  if (q.includes("food processing unit") || q.includes("license for food processing")) {
    return "Yes, you need an FSSAI license for a food processing unit. Additionally, you may need a factory license, a pollution control clearance, and a fire safety certificate depending on the scale of your operations.";
  }
  
  // 42. What are the guidelines for food packaging in India?
  if (q.includes("food packaging guidelines") || q.includes("food packaging rules")) {
    return "Food packaging must comply with FSSAI guidelines, ensuring food safety, labeling accuracy, and the use of approved materials. The packaging should include manufacturing and expiry dates, ingredients list, and nutritional information.";
  }
  
  // 43. What is the penalty for operating without a trade license?
  if (q.includes("penalty") && q.includes("without trade license")) {
    return "Operating without a trade license can result in penalties such as fines, suspension of business operations, or even legal action, depending on your location and the severity of the violation.";
  }
  
  // 44. How do I apply for a license for a food truck?
  if (q.includes("food truck license") || q.includes("apply for food truck")) {
    return "To operate a food truck, you need an FSSAI license, a trade license, a fire safety certificate, and an NOC from local traffic authorities. You may also need vehicle-related documents like an RTO approval.";
  }
  
  // 45. Can I run a food business without an FSSAI license?
  if (q.includes("run food business") && q.includes("without FSSAI")) {
    return "No, operating a food business without an FSSAI license is illegal. You must apply for the appropriate FSSAI license to comply with food safety regulations.";
  }
  
  // 46. What is the difference between FSSAI registration and FSSAI license?
  if (q.includes("FSSAI registration") && q.includes("difference") && q.includes("FSSAI license")) {
    return "FSSAI registration is for smaller food businesses (e.g., home-based food producers), while the FSSAI license is for larger-scale businesses that manufacture, distribute, or sell food products.";
  }
  
  // 47. How do I apply for a fire safety NOC?
  if (q.includes("fire safety NOC") || q.includes("apply fire safety NOC")) {
    return "To apply for a fire safety NOC, you need to submit an application to your local fire department. They will inspect your premises and issue a certificate if all fire safety standards are met.";
  }
  
  // 48. Do I need a NOC from the police for a food business?
  if (q.includes("police NOC") || q.includes("apply NOC from police")) {
    return "In some areas, a NOC from the local police may be required, especially if you are running a food business in a public space or require special permissions due to the nature of your business.";
  }
  
  // 49. Is it mandatory to have a fire exit in a food business?
  if (q.includes("fire exit") || q.includes("fire safety exit") && q.includes("food business")) {
    return "Yes, having a fire exit is mandatory for all food businesses, especially restaurants and kitchens. It ensures safety in case of emergencies and is a requirement for obtaining a fire safety certificate.";
  }
  
  // 50. How do I apply for GST for a food catering business?
  if (q.includes("GST for catering business") || q.includes("apply GST catering")) {
    return "You can apply for GST registration through the GST portal by submitting your PAN card, business details, and address proof. If your annual turnover exceeds ₹40 lakh, registration is mandatory.";
  }
  
  // 51. What are the food safety measures I need to follow in my restaurant?
  if (q.includes("food safety measures") || q.includes("restaurant food safety")) {
    return "To ensure food safety in your restaurant, you must follow FSSAI guidelines, maintain cleanliness, store food properly, and regularly train your staff on food handling and hygiene practices.";
  }
  
  // 52. Can I operate a food business in a residential area?
  if (q.includes("food business residential area") || q.includes("operating food business in residential area")) {
    return "It depends on local zoning laws. In some areas, you may need special permissions or an NOC to run a food business in a residential zone.";
  }
  
  // 53. Do I need to have a kitchen inspection for a food business?
  if (q.includes("kitchen inspection") || q.includes("food business kitchen inspection")) {
    return "Yes, a kitchen inspection is typically required for food businesses to ensure compliance with health, hygiene, and safety standards. This is part of obtaining licenses like FSSAI and trade licenses.";
  }
  
  // 54. How can I apply for an export license for my food products?
  if (q.includes("export license food products") || q.includes("apply for export license")) {
    return "To apply for an export license for food products, you need to contact the Directorate General of Foreign Trade (DGFT) and follow their application process, which includes providing product details and compliance with export regulations.";
  }
  
  // 55. Can I sell food at a festival without a license?
  if (q.includes("sell food at festival") || q.includes("license for festival food sale")) {
    return "No, you will need a temporary trade license, an FSSAI license, and a NOC from the event organizers. The food safety standards must be followed even for temporary events like festivals.";
  }
  
  // 56. How do I apply for a liquor license for a food business?
  if (q.includes("liquor license") || q.includes("apply liquor license")) {
    return "To apply for a liquor license, you need to submit an application to the excise department, comply with state-specific regulations, and undergo an inspection. The process and requirements vary from state to state.";
  }
  
  // 57. What is the role of a food safety supervisor in a food business?
  if (q.includes("food safety supervisor") || q.includes("role food safety supervisor")) {
    return "A food safety supervisor ensures compliance with food safety standards in the workplace. They oversee food handling, cleanliness, and hygiene practices and ensure that staff members follow regulations at all times.";
  }
  
  // 58. What licenses do I need to start a food manufacturing unit?
  if (q.includes("food manufacturing unit") || q.includes("licenses for food manufacturing")) {
    return "For a food manufacturing unit, you will need an FSSAI license, a trade license, a GST registration, and a fire safety certificate. Additionally, you may need a pollution control clearance depending on your manufacturing process.";
  }
  
  // 59. What is the FSSAI license number and how do I find it?
  if (q.includes("FSSAI license number") || q.includes("find FSSAI license number")) {
    return "Your FSSAI license number is given when you receive your FSSAI license. It should be displayed on all food products and business premises. You can find it in your FSSAI certificate or on the FSSAI portal.";
  }

  if (q.includes("start a food business") || q.includes("how to start food business")) {
    return "To start a food business in India, you need to register your business, get the necessary licenses (like FSSAI, GST, etc.), and ensure you follow food safety regulations. Make sure to choose a niche, find a location, and comply with local regulations.";
  }
  
  // 2. What are the best food business ideas for beginners?
  if (q.includes("best food business ideas") || q.includes("food business ideas for beginners")) {
    return "Some beginner-friendly food business ideas include catering services, cloud kitchens, food trucks, home-based baking, and snack production. Consider your skills, investment, and target market when choosing an idea.";
  }
  
  // 3. What is a business plan, and why is it important?
  if (q.includes("business plan") || q.includes("why business plan is important")) {
    return "A business plan outlines your business goals, strategies, financial projections, and operations. It is essential for guiding your business, securing funding, and ensuring long-term success.";
  }
  
  // 4. How can I get funding for my startup?
  if (q.includes("funding for startup") || q.includes("how to get funding")) {
    return "You can get funding for your startup through various means such as angel investors, venture capital, crowdfunding, loans, or government schemes. Make sure your business plan is solid when approaching potential investors.";
  }
  
  // 5. What is an entrepreneur?
  if (q.includes("entrepreneur") || q.includes("who is an entrepreneur")) {
    return "An entrepreneur is someone who starts, manages, and takes the risk of running a business. They often innovate and take steps to create new products or services to meet market demand.";
  }
  
  // 6. How do I register my food business legally?
  if (q.includes("register food business") || q.includes("food business registration")) {
    return "To register your food business, you need to apply for the necessary licenses like FSSAI, GST, and trade licenses. You must also register your business with the government (if required) and choose a legal structure like sole proprietorship, partnership, or company.";
  }
  
  // 7. What is the cost of starting a food business in India?
  if (q.includes("cost of starting food business") || q.includes("food business startup cost")) {
    return "The cost of starting a food business depends on factors like the type of business (restaurant, food truck, catering), location, licenses, equipment, and staff. A small food business can cost anywhere between ₹1 lakh to ₹10 lakh or more.";
  }
  
  // 8. How do I find a target audience for my food business?
  if (q.includes("target audience food business") || q.includes("how to find target audience")) {
    return "To find your target audience, analyze your product, location, and demographics. You can conduct market research, look at competitors, and use tools like social media analytics to understand your potential customers.";
  }
  
  // 9. What are the tax implications for a food business?
  if (q.includes("tax implications food business") || q.includes("taxes for food business")) {
    return "Food businesses are subject to GST, income tax, and possibly other local taxes. It is essential to maintain proper financial records and consult with a tax professional to ensure compliance with tax regulations.";
  }
  
  // 10. What is the role of marketing in a food business?
  if (q.includes("role of marketing") || q.includes("marketing in food business")) {
    return "Marketing plays a crucial role in attracting customers, building brand awareness, and increasing sales. In the food business, you can use social media, online platforms, and traditional advertising to promote your brand.";
  }
  
  // 11. How do I create a brand for my food business?
  if (q.includes("create a brand") || q.includes("food business brand creation")) {
    return "Creating a brand involves defining your unique value proposition, choosing a name and logo, and developing a marketing strategy. It's important to communicate your brand values and connect with your target audience.";
  }
  
  // 12. How do I hire employees for my food business?
  if (q.includes("hire employees") || q.includes("food business hiring")) {
    return "When hiring employees, you can post job listings on various job portals, use recruitment agencies, or look for candidates through social media. It's important to clearly define roles, job responsibilities, and expectations for each position.";
  }
  
  // 13. What is a franchise business model in the food industry?
  if (q.includes("franchise model") || q.includes("food industry franchise")) {
    return "A franchise business model allows you to use an established brand name and operating model in exchange for a franchise fee. It is a common approach in the food industry and can offer a proven way to enter the market.";
  }
  
  // 14. What is the minimum age to start a business in India?
  if (q.includes("minimum age to start business") || q.includes("age requirement for business in India")) {
    return "The minimum age to start a business in India is 18 years. However, if you're below 18, you can still start a business under the guardianship of a parent or legal guardian.";
  }
  
  // 15. Can I operate a food business from home?
  if (q.includes("operate food business from home") || q.includes("home-based food business")) {
    return "Yes, you can run a food business from home, provided you meet the local zoning regulations and obtain the required licenses (like FSSAI registration). Home-based businesses like catering or baking are common in this sector.";
  }
  
  // 16. What are the health and safety regulations for a food business?
  if (q.includes("health and safety regulations") || q.includes("food business safety regulations")) {
    return "Health and safety regulations for food businesses include maintaining cleanliness, following food safety protocols, using safe ingredients, storing food properly, and ensuring hygienic food preparation practices.";
  }
  
  // 17. What is the best location for a food business?
  if (q.includes("best location for food business") || q.includes("food business location tips")) {
    return "The best location for a food business depends on factors such as foot traffic, target customers, accessibility, competition, and rent prices. Popular areas include shopping malls, near schools or office areas, or even food markets for street food businesses.";
  }
  
  // 18. How do I conduct market research for my food business?
  if (q.includes("conduct market research") || q.includes("market research food business")) {
    return "To conduct market research, you can survey potential customers, analyze competitors, and look at trends in the food industry. Understanding customer needs and preferences is crucial for tailoring your products and services.";
  }
  
  // 19. How do I build a website for my food business?
  if (q.includes("build website food business") || q.includes("food business website development")) {
    return "To build a website for your food business, you can use website builders like Wix, WordPress, or hire a web developer. Ensure your site is mobile-friendly, includes a menu, contact information, and online ordering if needed.";
  }
  
  // 20. How do I apply for government subsidies for a food business?
  if (q.includes("government subsidies") || q.includes("food business subsidies")) {
    return "To apply for government subsidies, you need to check for schemes under the Ministry of Food Processing, the MSME ministry, or your state government. Visit the respective websites and submit the required documents and forms.";
  }
  
  // 21. What are the different types of food businesses?
  if (q.includes("types of food businesses") || q.includes("food business models")) {
    return "Food businesses can be categorized into several types, including restaurants, cafes, food trucks, cloud kitchens, catering services, food manufacturing units, and home-based food businesses like baking or meal prepping.";
  }
  
  // 22. How do I create a marketing strategy for my food business?
  if (q.includes("marketing strategy food business") || q.includes("how to create marketing strategy for food business")) {
    return "Creating a marketing strategy for your food business involves defining your target audience, choosing marketing channels (social media, offline marketing), offering promotions, and ensuring excellent customer service to build brand loyalty.";
  }
  
  // 23. What are the legal structures available for my startup?
  if (q.includes("legal structures for startup") || q.includes("startup business structures")) {
    return "The common legal structures for a startup in India include sole proprietorship, partnership, limited liability partnership (LLP), and private limited company. The structure you choose affects your taxes, liabilities, and operations.";
  }
  
  // 24. How do I ensure food quality and consistency in my food business?
  if (q.includes("ensure food quality") || q.includes("food business quality control")) {
    return "To ensure food quality and consistency, create standard operating procedures (SOPs) for food preparation, train your staff regularly, maintain quality ingredients, and conduct regular inspections to monitor food standards.";
  }

  if (q.includes("why FSSAI") || q.includes("why do I need FSSAI")) {
    return "FSSAI (Food Safety and Standards Authority of India) is required to ensure that your food business meets hygiene and safety standards. It ensures that the food you serve is safe for consumption and compliant with health regulations.";
  }
  
  // 2. Why do I need a GST registration for my food business?
  if (q.includes("why GST registration") || q.includes("why do I need GST")) {
    return "GST registration is mandatory for businesses with a turnover exceeding ₹40 lakhs. It ensures proper tax compliance and helps you claim input tax credits on your purchases, thereby lowering your overall tax burden.";
  }
  
  // 3. Why do I need a trade license for my food business?
  if (q.includes("why trade license") || q.includes("why do I need trade license")) {
    return "A trade license is required to legally operate your business in a specific location. It ensures that your business complies with local municipal laws and zoning regulations.";
  }
  
  // 4. Why is fire safety important for food businesses?
  if (q.includes("why fire safety") || q.includes("why do I need fire safety")) {
    return "Fire safety is crucial to protect your staff, customers, and property. The food business involves cooking, heating, and storing flammable items, which require preventive measures like fire extinguishers and fire exits.";
  }
  
  // 5. Why do I need an FSSAI registration for home-based food businesses?
  if (q.includes("why FSSAI for home-based business") || q.includes("why FSSAI home business")) {
    return "Even home-based food businesses need FSSAI registration to ensure food safety. It helps you comply with hygiene standards and gain consumer trust, allowing your home-based venture to grow legally and successfully.";
  }
  
  // 6. Why do I need an NOC from RTO for a food truck?
  if (q.includes("why NOC from RTO") || q.includes("why do I need NOC from RTO")) {
    return "An NOC (No Objection Certificate) from the RTO is required for a food truck to ensure the vehicle complies with road safety regulations and is fit for commercial use, including permits for operating in certain areas.";
  }
  
  // 7. Why do I need an environmental clearance for my food business?
  if (q.includes("why environmental clearance") || q.includes("why do I need environmental clearance")) {
    return "An environmental clearance ensures that your food business doesn’t harm the environment. It’s required for businesses generating waste, consuming energy, or discharging pollutants, such as packaging waste from food manufacturing.";
  }
  
  // 8. Why do I need a health trade license for a restaurant?
  if (q.includes("why health trade license") || q.includes("why do I need health trade license")) {
    return "A health trade license ensures that your restaurant complies with food safety and health regulations. It’s required to guarantee that your establishment meets hygiene standards for food preparation and service.";
  }
  
  // 9. Why is it necessary to have a food safety audit for my food business?
  if (q.includes("why food safety audit") || q.includes("why do I need food safety audit")) {
    return "A food safety audit is necessary to evaluate your food handling and safety practices. It ensures your business is compliant with FSSAI regulations and helps in maintaining food hygiene, thus protecting your brand and customers.";
  }
  
  // 10. Why do I need a business registration certificate for my food business?
  if (q.includes("why business registration certificate") || q.includes("why do I need business registration")) {
    return "A business registration certificate is essential for legal recognition of your food business. It helps establish credibility, protects your brand, and enables you to enter into contracts and partnerships legally.";
  }
  
  // 11. Why do I need an import export code (IEC) for my food business?
  if (q.includes("why IEC") || q.includes("why do I need import export code")) {
    return "IEC is required if your food business deals with importing or exporting goods. It’s essential for smooth and legal transactions in the global food trade, ensuring you comply with government regulations.";
  }
  
  // 12. Why is it necessary to have a pollution control certificate for my food business?
  if (q.includes("why pollution control certificate") || q.includes("why do I need pollution control certificate")) {
    return "A pollution control certificate ensures that your food business complies with environmental regulations, especially if your operations produce waste, emissions, or discharge that might harm the environment.";
  }
  
  // 13. Why do I need a factory license for a food manufacturing unit?
  if (q.includes("why factory license") || q.includes("why do I need factory license")) {
    return "A factory license is required to legally run a food manufacturing unit. It ensures compliance with industrial and labor regulations, such as workplace safety, equipment maintenance, and proper disposal of waste.";
  }
  
  // 14. Why is food labeling important for my food products?
  if (q.includes("why food labeling") || q.includes("why do I need food labeling")) {
    return "Food labeling provides essential information to consumers about the ingredients, nutritional values, expiry dates, and any allergens in your products. It ensures transparency and consumer safety, and is required by FSSAI.";
  }
  
  // 15. Why do I need a VAT registration for my food business?
  if (q.includes("why VAT registration") || q.includes("why do I need VAT registration")) {
    return "VAT registration is necessary if your food business sells taxable goods. It helps in tracking and collecting taxes on your sales, ensuring compliance with tax laws, and benefiting from input tax credit.";
  }
  
  // 16. Why is a food hygiene certificate necessary for my food business?
  if (q.includes("why food hygiene certificate") || q.includes("why do I need food hygiene certificate")) {
    return "A food hygiene certificate proves that your food business follows necessary health and hygiene standards in food preparation and storage. It helps assure customers about the cleanliness and safety of your food.";
  }
  
  // 17. Why do I need a liquor license for my restaurant?
  if (q.includes("why liquor license") || q.includes("why do I need liquor license")) {
    return "A liquor license is required if you plan to sell or serve alcohol in your restaurant. It ensures you are following legal and regulatory requirements for alcohol sale, including age restrictions and hours of service.";
  }
  
  // 18. Why do I need a packaging license for my food business?
  if (q.includes("why packaging license") || q.includes("why do I need packaging license")) {
    return "A packaging license ensures that your food packaging materials are safe, compliant with environmental standards, and fit for food contact. It helps to maintain product quality and prevents contamination during transportation.";
  }
  
  // 19. Why do I need a quality control certification for my food products?
  if (q.includes("why quality control certification") || q.includes("why do I need quality control certification")) {
    return "A quality control certification ensures that your food products meet industry standards. It provides your customers with assurance that your products are safe, consistent, and of high quality.";
  }
  
  // 20. Why do I need a zoning permit for my food business?
  if (q.includes("why zoning permit") || q.includes("why do I need zoning permit")) {
    return "A zoning permit ensures that your food business complies with local zoning laws. It verifies that your business is allowed to operate in your chosen location, whether it’s a commercial or residential area.";
  }
  
  // 21. Why do I need a food waste disposal license?
  if (q.includes("why food waste disposal license") || q.includes("why do I need food waste disposal license")) {
    return "A food waste disposal license is required to manage and dispose of food waste properly. It ensures compliance with waste disposal regulations, which helps in preventing environmental pollution and health hazards.";
  }
  
  // 22. Why is a health inspection necessary for a food business?
  if (q.includes("why health inspection") || q.includes("why do I need health inspection")) {
    return "A health inspection is necessary to ensure that your food business complies with public health and food safety standards. It’s a regulatory requirement to ensure hygienic food preparation and safe handling practices.";
  }
  
  // 23. Why do I need a consumer protection certificate for my food business?
  if (q.includes("why consumer protection certificate") || q.includes("why do I need consumer protection certificate")) {
    return "A consumer protection certificate assures that your food business treats customers fairly and adheres to consumer rights laws. It is important to build trust and avoid legal issues related to unfair trade practices.";
  }
  
  // 24. Why is an operational permit necessary for my food business?
  if (q.includes("why operational permit") || q.includes("why do I need operational permit")) {
    return "An operational permit is necessary to ensure that your food business complies with safety regulations and local ordinances. It validates that your business meets the legal requirements for operations in your area.";
  }
  
  // 25. Why do I need a transport license for my food business?
  if (q.includes("why transport license") || q.includes("why do I need transport license")) {
    return "A transport license is required if your food business involves transporting goods. It ensures that your transportation methods comply with safety and quality standards to maintain the integrity of your food products during transit.";
  }
  // Default fallback
  return (
    "Thanks for your question! Unfortunately, I’m not trained to answer that right now. 🤖\n" +
    "But I can help you with compliance, licenses, and startup queries. Try asking:\n\n" +
    "• What licenses do I need to start my food business?\n" +
    "• Why is FSSAI important?\n" +
    "• When is the Income Tax filing deadline?\n" +
    "• What is the status of my GST registration?\n" +
    "• How do I get a Fire Safety license?\n" +
    "• What is the Shop & Establishment Act?\n" +
    "• How do I register my startup with DPIIT?\n" +
    "• Can I run my business from home?\n\n" +
    "Just type your question and I’ll do my best to help! 💼✨"
  );
  }
};

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your StartKaro assistant. How can I help with your startup journey today?",
      role: "bot",
      timestamp: new Date()
    }
  ]);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [userUploads, setUserUploads] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const preventAutoScroll = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch knowledge base data
  const { data: knowledgeData, isLoading: isLoadingKnowledge } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        documents: [
          { id: '1', name: 'user_profile.pdf', type: 'application/pdf', size: '1.2 MB' },
          { id: '2', name: 'compliance_report.pdf', type: 'application/pdf', size: '2.5 MB' },
          { id: '3', name: 'business_plan.pdf', type: 'application/pdf', size: '3.1 MB' }
        ]
      };
    },
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      
      // Create attachment object
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size)
      };
      
      // Add to attachments
      setAttachments(prev => [...prev, newAttachment]);
      
      // In a real app, you'd upload this file to your backend
      toast.success(`"${file.name}" added to your message`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    const file = e.target.files![0];
    const form = new FormData();
    form.append("file", file);

  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsSending(true);
    
    try {
      // Show typing indicator with loading state
      const response = await ChatService.askQuestion(input, userUploads);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      if (isFirstMessage) {
        setIsFirstMessage(false);
      }
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!preventAutoScroll.current && endOfMessagesRef.current && messages.length > 1) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
    preventAutoScroll.current = false;
  }, [messages]);

  // Handle scroll events to prevent jumping when user is scrolling up
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isScrolledNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      preventAutoScroll.current = !isScrolledNearBottom;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <h2 className="text-lg font-semibold">StartKaro Assistant</h2>
        </div>
      </div>

      {/* Main chat area with messages */}
      <ScrollArea 
        className="flex-1 p-4 overflow-auto" 
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "bot" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {message.role === "bot" ? "Assistant" : "You"}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Display attachments if any */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div 
                          key={attachment.id} 
                          className="flex items-center gap-2 bg-white/10 p-2 rounded-md"
                        >
                          <File className="h-4 w-4" />
                          <span className="text-xs truncate">{attachment.name}</span>
                          <span className="text-xs opacity-70">{attachment.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-4 bg-muted">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4" />
                  <span className="font-medium">Assistant</span>
                </div>
                <LoadingDots />
              </div>
            </div>
          )}

          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      {/* Input area for user messages */}
      <div className="p-4 border-t">
        {/* Display selected attachments */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <Badge 
                key={attachment.id} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                <File className="h-3 w-3" />
                <span className="text-xs truncate max-w-[150px]">{attachment.name}</span>
                <button 
                  onClick={() => removeAttachment(attachment.id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about startup requirements, legal compliances, or sector-specific regulations..."
            className="resize-none"
            rows={2}
          />
          <div className="flex flex-col gap-2 self-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10"
                  >
                    <Paperclip className="h-4 w-4" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach a file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              onClick={handleSendMessage}
              disabled={(!input.trim() && attachments.length === 0) || isSending}
              className="h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Your chatbot is connected to your personal knowledge base and will provide personalized guidance based on your business information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
