"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput
} from "@mui/material";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

const countryCodes = [
  { code: "+91", label: "🇮🇳" },
  // Add more country codes as needed
];

export default function RegisterPage() {
  const [tab, setTab] = useState(1); // 0: Sign In, 1: Get Started
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"register" | "otp">("register");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    if (newValue === 0) router.replace("/login");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: countryCode + phone,
          password
        })
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
      } else {
        setStep("otp");
      }
    } catch (err) {
      setError("Unknown error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: countryCode + phone,
          otp
        })
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
      } else {
        router.replace("/login");
      }
    } catch (err) {
      setError("Unknown error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Box width="100%">
        <Card sx={{ p: 2 }}>
          <CardHeader
            title={<Typography variant="h5">Eco-Retail</Typography>}
            subheader={<Typography variant="body2" color="text.secondary">Create an account to get started.</Typography>}
            sx={{ textAlign: "center" }}
          />
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label="Sign In" />
            <Tab label="Get Started" />
          </Tabs>
          <CardContent>
            {step === "register" ? (
              <form onSubmit={handleRegister}>
                <TextField
                  label="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="name"
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="email"
                />
                <Box display="flex" alignItems="center" gap={1}>
                  <FormControl sx={{ minWidth: 80 }}>
                    <InputLabel>Code</InputLabel>
                    <Select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      input={<OutlinedInput label="Code" />}
                    >
                      {countryCodes.map(c => (
                        <MenuItem key={c.code} value={c.code}>{c.label} {c.code}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                    fullWidth
                    margin="normal"
                    autoComplete="tel"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="new-password"
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="new-password"
                />
                {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, fontWeight: 600 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Get OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtp}>
                <TextField
                  label="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  fullWidth
                  margin="normal"
                  autoFocus
                />
                {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, fontWeight: 600 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP & Register"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 