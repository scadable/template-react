import { Refine } from "@refinedev/core";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routerProvider from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Home, Login } from './pages'

// Theme configuration for Material UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Refine>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
