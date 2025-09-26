import { useLogin } from "@refinedev/core";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useBreakpoints } from "../../../hooks";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { mutate: login, isPending } = useLogin<LoginFormData>();
  const { isMobile } = useBreakpoints();
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Please input your email!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email!";
    }

    if (!formData.password) {
      newErrors.password = "Please input your password!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const cardStyle = {
    width: isMobile ? "100%" : 400,
    margin: isMobile ? "16px" : 0,
    maxWidth: isMobile ? "calc(100vw - 32px)" : 400,
  };

  return (
    <Card sx={cardStyle} elevation={3}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          mb={4}
          fontWeight="bold"
        >
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color={errors.email ? "error" : "action"} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange("password")}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color={errors.password ? "error" : "action"} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isPending}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isPending ? "Signing in..." : "Login"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}