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
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";

export default function LoginPage() {
  const [tab, setTab] = useState(0); // 0: Sign In, 1: Get Started
  const [loginType, setLoginType] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    if (newValue === 1) router.replace("/register");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    let loginValue = loginType === "email" ? email : phone;
    if (!loginValue || !password) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: loginValue, password })
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
      } else {
        // Store user info in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('ecoUser', JSON.stringify(data.user));
        }
        router.replace("/"); // Redirect to home or dashboard
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
            subheader={<Typography variant="body2" color="text.secondary">Sign in to your account to continue.</Typography>}
            sx={{ textAlign: "center" }}
          />
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label="Sign In" />
            <Tab label="Get Started" />
          </Tabs>
          <CardContent>
            <form onSubmit={handleLogin}>
              <RadioGroup
                row
                value={loginType}
                onChange={e => setLoginType(e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel value="email" control={<Radio />} label={<Typography>Email</Typography>} />
                <FormControlLabel value="phone" control={<Radio />} label={<Typography>Phone</Typography>} />
              </RadioGroup>
              {loginType === "email" ? (
                <TextField
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  autoComplete="email"
                />
              ) : (
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  fullWidth
                  margin="normal"
                  autoComplete="tel"
                />
              )}
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="current-password"
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
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 