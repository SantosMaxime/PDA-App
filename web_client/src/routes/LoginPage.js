import React, { useState } from "react";
import {
    Grid,
    Button,
    TextField,
    Typography,
    CircularProgress,
    IconButton,
    InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ParticleBackground from "../components/ParticleBackground";
import { useNavigate } from "react-router-dom";
import { authLogin } from "../api/AuthRequests";
import { authSpotify } from "../api/SpecialAuthRequest";
import { validateEmail } from "../utils/validations";
import { useUser } from "../context/UserContext";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const { getLoggedIn, login, logout, setUser, setValidToken } = useUser();

    const validateCredentials = () => {
        setEmailError(false);
        setPasswordError(false);
        setErrorMessage("");

        if (!email && !password) {
            setErrorMessage("Un email et un mot de passe sont requis");
            setEmailError(true);
            setPasswordError(true);
            return false;
        } else if (!email) {
            setEmailError(true);
            setPasswordError(false);
            setErrorMessage("Un email est requis");
            return false;
        } else if (!password) {
            setErrorMessage("Un mot de passe est requis");
            return false;
        }
        if (!validateEmail(email)) {
            setErrorMessage("L'email n'est pas valide");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateCredentials()) return;

        setLoading(true);

        try {
            const data = await authLogin(email, password, null);
            login(data.token);
            setUser(data.user);
            setValidToken(true);
            setLoading(false);
            navigate("/");
        } catch (error) {
            setLoading(false);
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage("l'email ou le mot de passe est incorrect");
                } else {
                    setErrorMessage(
                        "Une erreur s'est produite, veuillez réessayer plus tard",
                    );
                }
            } else
                setErrorMessage(
                    "Une erreur s'est produite, veuillez réessayer plus tard",
                );
            logout();
            setValidToken(false);
        }
    };

    const handleSpotifyLogin = async () => {
        await authSpotify();
    }



    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="loginPage">
            <ParticleBackground />
            <Grid
                container
                justifyContent="right"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: "none",
                }}
            >
                <Grid
                    item
                    xs={12}
                    md={5}
                    lg={4}
                    style={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fbfcfe",
                        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                        pointerEvents: "auto",
                    }}
                >
                    {getLoggedIn() ? (
                        <Grid
                            item
                            xs={12}
                            style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                flexDirection: "column",
                            }}
                        >
                            <Typography>
                                Vous êtes toujours connecté.
                            </Typography>
                            <Typography sx={{ mt: 2, ml: 5, mr: 5 }}>
                                Vous pouvez choisir d'être redirigé vers le menu
                                ou de vous déconnecter.
                            </Typography>
                            <CircularProgress sx={{ mt: 5 }} />
                            <Typography
                                sx={{
                                    mt: 5,
                                    fontSize: 12,
                                    color: "grey",
                                }}
                            >
                                Vous pouvez regarder ce chargement pendant votre
                                décision.
                            </Typography>
                            <Grid
                                item
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    gap: "40px",
                                    width: "85%",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate("/")}
                                    fullWidth
                                    sx={{
                                        mt: 4,
                                        borderRadius: 25,
                                        height: "45px",
                                    }}
                                >
                                    Menu
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleLogout}
                                    fullWidth
                                    sx={{
                                        mt: 4,
                                        borderRadius: 25,
                                        height: "45px",
                                    }}
                                >
                                    Déconnexion
                                </Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid
                            item
                            xs={12}
                            style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            <Grid
                                item
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    flexDirection: "column",
                                    width: "75%",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        mt: 2,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Connexion
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    width: "60%",
                                }}
                            >
                                {loading ? (
                                    <Grid
                                        item
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <CircularProgress sx={{ mt: 5 }} />
                                    </Grid>
                                ) : (
                                    <>
                                    <Grid
                                        item
                                        sx={{ height: "100%", width: "100%" }}
                                    >
                                        <TextField
                                            label="Adresse e-mail"
                                            variant="standard"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            margin="normal"
                                            fullWidth
                                            error={emailError}
                                            sx={{
                                                borderRadius: 25,
                                                height: "50px",
                                            }}
                                        />
                                        <TextField
                                            label="Mot de passe"
                                            variant="standard"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            error={passwordError}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword,
                                                                )
                                                            }
                                                            edge="end"
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            margin="normal"
                                            fullWidth
                                            sx={{
                                                mt: 2,
                                                borderRadius: 25,
                                                height: "50px",
                                            }}
                                        />
                                        {errorMessage && (
                                            <Typography color="error">
                                                {errorMessage}
                                            </Typography>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleLogin}
                                            fullWidth
                                            sx={{
                                                mt: 4,
                                                borderRadius: 25,
                                                height: "50px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                    </Grid>

                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            // green color
                                            color="success"
                                            onClick={handleSpotifyLogin}
                                            fullWidth
                                            sx={{

                                                mt: 4,
                                                borderRadius: 25,
                                                height: "50px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Se connecter avec Spotify
                                        </Button>
                                    </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

export default LoginPage;
