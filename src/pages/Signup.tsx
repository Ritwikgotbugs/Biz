
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simple redirect component that sends users to the Login page with signup tab active
const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login", { state: { tab: "signup" } });
  }, [navigate]);

  return null; // This component renders nothing
};

export default Signup;
