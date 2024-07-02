import React, { useState, useEffect, useRef } from "react";
import { Box, SpeedDial, SpeedDialAction, styled } from "@mui/material";
import { MuiColorInput, matchIsValidColor } from "mui-color-input";
import SettingsIcon from "@mui/icons-material/Settings";
import AdjustIcon from "@mui/icons-material/Adjust";
import AttractionsIcon from "@mui/icons-material/Attractions";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import RestoreIcon from "@mui/icons-material/Restore";
import SpeedIcon from "@mui/icons-material/Speed";
import HeightIcon from "@mui/icons-material/Height";
import PaletteIcon from "@mui/icons-material/Palette";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
        top: theme.spacing(2),
        left: theme.spacing(2),
    },
}));

const StyledMuiColorInput = styled(MuiColorInput)(() => ({
    position: "absolute",
    zIndex: 2,
    left: "150px",
    bottom: "10px",
    transform: "translate(-50%, -50%)",
}));

const actions = [
    {
        icon: <AdjustIcon />,
        name: "mouseRepelEffectRadius",
        actionFactor: 1,
    },
    {
        icon: <AttractionsIcon />,
        name: "mouseAttractEffectRadius",
        actionFactor: 1,
    },
    { icon: <ManageHistoryIcon />, name: "returnRadius", actionFactor: 1 },
    { icon: <RestoreIcon />, name: "particleReturnTime", actionFactor: 500 },
    { icon: <SpeedIcon />, name: "maxVelocity", actionFactor: 0.5 },
    { icon: <HeightIcon />, name: "particleSize", actionFactor: 1 },
    { icon: <PaletteIcon />, name: "particleColor", actionFactor: null },
];

const basicColors = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
];

function ParticleBackgroundOptions({ refs, updateProperty }) {
    const [values, setValues] = React.useState({
        mouseRepelEffectRadius: refs.mouseRepelEffectRadius.current,
        mouseAttractEffectRadius: refs.mouseAttractEffectRadius.current,
        returnRadius: refs.returnRadius.current,
        particleReturnTime: refs.particleReturnTime.current,
        maxVelocity: refs.maxVelocity.current,
        particleSize: refs.particleSize.current,
        particleColor: refs.particleColor.current,
    });
    const actionRefs = useRef(actions.map(() => null)); // Create a ref for each action
    const isOptionsMenuOpen = useRef(false);
    const [color, setColor] = useState(refs.particleColor.current.value);

    useEffect(() => {
        const updateValuesOnScroll = (actionName, index) => {
            const factor = actions[index].actionFactor || 0;
            const updateValue = (delta) => {
                if (delta === 0) return;
                if (actions[index].name === "particleColor") {
                    if (delta === 1) {
                        const currentColor = refs[actionName].current.value;
                        const colorIndex = basicColors.indexOf(currentColor);
                        const newColor =
                            colorIndex === -1
                                ? basicColors[0]
                                : basicColors[
                                      (colorIndex + 1) % basicColors.length
                                  ];
                        setColor(newColor);
                        refs[actionName].current.value = newColor;
                        updateProperty(actionName, newColor);
                    } else if (delta === -1) {
                        const currentColor = refs[actionName].current.value;
                        const colorIndex = basicColors.indexOf(currentColor);
                        const newColor =
                            colorIndex === -1
                                ? basicColors[basicColors.length - 1]
                                : basicColors[
                                      (colorIndex - 1 + basicColors.length) %
                                          basicColors.length
                                  ];
                        setColor(newColor);
                        refs[actionName].current.value = newColor;
                        updateProperty(actionName, newColor);
                    }
                } else {
                    const newValue = Math.max(
                        0,
                        parseInt(refs[actionName].current.value) +
                            delta * factor,
                    );
                    setValues((prevValues) => ({
                        ...prevValues[actionName],
                        [actionName]: newValue,
                    }));
                    updateProperty(actionName, delta, factor);
                }
            };
            const handleScroll = (event) => {
                event.preventDefault();
                const delta = event.deltaY < 0 ? 1 : -1;
                updateValue(delta);
            };

            const handleArrow = (event) => {
                event.preventDefault();
                let delta = 0;
                if (event.ctrlKey) {
                    switch (event.key) {
                        case "ArrowUp":
                            delta = 1;
                            break;
                        case "ArrowDown":
                            delta = -1;
                            break;
                        default:
                            break;
                    }
                }
                updateValue(delta);
            };

            const ref = actionRefs.current[index];
            if (ref) {
                ref.addEventListener("wheel", handleScroll, { passive: false });
                ref.addEventListener("keydown", handleArrow, {
                    passive: false,
                });
                return () => {
                    ref.removeEventListener("wheel", handleScroll);
                    // ref.removeEventListener("keydown", handleArrow);
                };
            }
        };

        actions.forEach(({ name }, index) => updateValuesOnScroll(name, index));
    }, [updateProperty, refs]);

    const toggleDisplay = (name) => {
        const currentDisplay = refs[name].current.display;
        refs[name].current.display = !currentDisplay;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: { ...prevValues[name], display: !currentDisplay },
        }));
    };

    const handleChangeColor = (newValue) => {
        if (matchIsValidColor(newValue)) {
            setColor(newValue); // Update state, which triggers the input's re-render
            refs["particleColor"].current.value = newValue;
            updateProperty("particleColor", newValue); // Assume you handle this in your update logic
        }
    };

    return (
        <Box>
            <StyledSpeedDial
                ariaLabel="Particles Options"
                icon={<SettingsIcon />}
                direction="right"
                onOpen={() => (isOptionsMenuOpen.current = true)}
                onClose={() => (isOptionsMenuOpen.current = true)}
            >
                {actions.map((action, index) => (
                    <SpeedDialAction
                        ref={(el) => (actionRefs.current[index] = el)}
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={
                            refs[action.name].current.type !== "time"
                                ? `${action.name}: ${refs[action.name].current.value}`
                                : `${action.name}: ${refs[action.name].current.value / 1000}s`
                        }
                        onClick={() => toggleDisplay(action.name)}
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: refs[action.name].current.display
                                ? "#000000"
                                : "#ffffff",
                            color: refs[action.name].current.display
                                ? "#fff"
                                : "",
                            "&:hover": {
                                backgroundColor: refs[action.name].current
                                    .display
                                    ? "transparent"
                                    : "transparent",
                                color: "#fff",
                            },
                        }}
                    />
                ))}
            </StyledSpeedDial>
            <StyledMuiColorInput
                format="rgb"
                value={color}
                onChange={handleChangeColor}
                label="Particle Color"
                sx={{
                    display: refs["particleColor"].current.display
                        ? "block"
                        : "none",
                }}
            />
        </Box>
    );
}

export default ParticleBackgroundOptions;
