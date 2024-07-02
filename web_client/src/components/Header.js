import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import "../css/Header.css";
import { useUser } from "../context/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSpotifyContext } from "../context/SpotifyContext";

function Header() {
    const { user, logout } = useUser();

    const { device } = useSpotifyContext();
    let username = "Guest";
    if (device) {
        username = device.name
    }


    return (
        <Grid container className={"Header-container"}>
            <Paper
                elevation={4}
                className={"Header-paper"}
                style={{ borderRadius: 0 }}
            >
                <Grid
                    container
                    sx={{ height: "100%", justifyContent: "space-between" }}
                >
                    <Grid
                        item
                        xs={5}
                        sx={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                        }}
                    >
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        sx={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                        }}
                    >
                        <h1>PDA (Main Page)</h1>
                    </Grid>
                    <Grid
                        item
                        xs={5}
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "center",
                            alignItems: "center",
                            overflow: "hidden",
                        }}
                    >
                        {username ? (
                            <Grid
                                item
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "end",
                                    alignItems: "center",
                                    gap: "30px",
                                    paddingRight: "50px",
                                }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        height: "70%",
                                        width: username.length * 20 + "px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        className={"Login-Typography"}
                                        fontStyle={{
                                            fontFamily: "Arial",
                                            fontSize: "1.5em",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {username}
                                    </Typography>
                                </Paper>
                                <LogoutIcon
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease-in-out",
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                        },
                                    }}
                                    style={{
                                        fontSize: "32px",
                                        color: "black",
                                    }}
                                    onClick={() => {
                                        logout();
                                    }}
                                />
                            </Grid>
                        ) : null}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
}

export default Header;
