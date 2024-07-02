import React, { useEffect, useRef, useCallback } from "react";
import ParticleBackgroundOptions from "./ParticleBackgroundOptions";
import "../css/ParticleBackground.css";
import {
    displayMouseRadius,
    displayParticleEndpoint,
} from "../utils/DisplayProperties";

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const textCanvasRef = useRef(null);
    const mousePos = useRef({ x: null, y: null });
    const isLeftMouseDown = useRef(false);
    const particlesArray = useRef([]);

    const refs = {
        mouseRepelEffectRadius: useRef({
            value: 100,
            name: "Mouse Repel Effect Radius",
            type: "mouse-radius",
            display: false,
        }),
        mouseAttractEffectRadius: useRef({
            value: 200,
            name: "Mouse Attract Effect Radius",
            type: "mouse-radius",
            display: false,
        }),
        returnRadius: useRef({
            value: 500,
            name: "Return Radius",
            type: "particle-radius",
            display: false,
        }),
        particleReturnTime: useRef({
            value: 1000,
            name: "Particle Return Time",
            type: "time",
            display: false,
        }),
        maxVelocity: useRef({
            value: 6,
            name: "Max Velocity",
            type: "velocity",
            display: false,
        }),
        particleSize: useRef({
            value: 2,
            name: "Particle Size",
            type: "size",
            display: false,
        }),
        particleColor: useRef({
            value: "#ffffff",
            name: "Particle Color",
            type: "color",
            display: false,
        }),
    };

    const updateMousePosition = useCallback((event) => {
        mousePos.current = { x: event.clientX, y: event.clientY };
    }, []);

    const handleMouseDown = useCallback((event) => {
        if (event.button === 0) isLeftMouseDown.current = true;
    }, []);

    const handleMouseUp = useCallback((event) => {
        if (event.button === 0) isLeftMouseDown.current = false;
    }, []);

    const prepareCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const textCanvas = textCanvasRef.current;
        if (!canvas || !textCanvas) return;
        const scaleFactor = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * scaleFactor;
        canvas.height = window.innerHeight * scaleFactor;
        textCanvas.width = window.innerWidth * scaleFactor;
        textCanvas.height = window.innerHeight * scaleFactor;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        textCanvas.style.width = `${window.innerWidth}px`;
        textCanvas.style.height = `${window.innerHeight}px`;

        const ctx = textCanvas.getContext("2d", {
            willReadFrequently: true,
        });
        ctx.fillStyle = "#000"; // Set fill color for text for contrast
        ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.fillStyle = "#fff"; // Text color
        ctx.font = "bold 6rem Arial";
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.2rem";
        ctx.fillText("Welcome on", canvas.width / 3, 424);
        ctx.fillText("your PDA", canvas.width / 3, 584);
    }, []);

    const generateParticles = useCallback(() => {
        const textCanvas = textCanvasRef.current;
        if (!textCanvas) return;
        const ctx = textCanvas.getContext("2d");
        const imageData = ctx.getImageData(
            0,
            0,
            textCanvas.width,
            textCanvas.height,
        );
        const particles = [];
        for (let y = 0; y < imageData.height; y += 4) {
            // Adjust '4' based on your sample size needs
            for (let x = 0; x < imageData.width; x += 4) {
                const index = (y * imageData.width + x) * 4;
                if (imageData.data[index] > 128) {
                    // Adjust '128' based on your threshold needs
                    particles.push({
                        x,
                        y,
                        originalX: x,
                        originalY: y,
                        velocityX: 0,
                        velocityY: 0,
                        mustReturn: false,
                        timer: null,
                        isMoving: false,
                    });
                }
            }
        }
        particlesArray.current = particles;
    }, []);

    const updateParticles = useCallback(() => {
        const particles = particlesArray.current;

        const capVelocity = (velocity) => {
            return Math.max(
                Math.min(velocity, refs.maxVelocity.current.value),
                -refs.maxVelocity.current.value,
            );
        };

        particles.forEach((particle) => {
            const particleDX = particle.originalX - particle.x;
            const particleDY = particle.originalY - particle.y;
            const distanceToOrigin = Math.sqrt(
                particleDX * particleDX + particleDY * particleDY,
            );
            const mouseDX = mousePos.current.x - particle.x;
            const mouseDY = mousePos.current.y - particle.y;
            const distanceToMouse = Math.sqrt(
                mouseDX * mouseDX + mouseDY * mouseDY,
            );

            const forceDirectionX = mouseDX / distanceToMouse;
            const forceDirectionY = mouseDY / distanceToMouse;

            const distanceParticleOriginToMouse = Math.sqrt(
                (particle.originalX - mousePos.current.x) *
                    (particle.originalX - mousePos.current.x) +
                    (particle.originalY - mousePos.current.y) *
                        (particle.originalY - mousePos.current.y),
            );
            // if the particle origin is inside the mouse effect radius, don't return
            const isMouseEffecting =
                distanceParticleOriginToMouse <
                refs.mouseRepelEffectRadius.current.value;

            if (
                isLeftMouseDown.current &&
                distanceToMouse < refs.mouseAttractEffectRadius.current.value
            ) {
                particle.velocityX += forceDirectionX * 0.5; // Increase speed by a small amount towards the cursor
                particle.velocityY += forceDirectionY * 0.5;
                // Cap velocity
                particle.velocityX = capVelocity(particle.velocityX);
                particle.velocityY = capVelocity(particle.velocityY);
                particle.mustReturn = false;
            } else if (distanceToOrigin > refs.returnRadius.current.value) {
                // if the particle origin is inside the mouse effect radius, don't return
                if (isMouseEffecting) {
                    particle.mustReturn = false;
                } else {
                    particle.velocityX +=
                        (particle.originalX - particle.x) * 0.01;
                    particle.velocityY +=
                        (particle.originalY - particle.y) * 0.01;
                    particle.mustReturn = true;
                }
            } else if (
                distanceToMouse < refs.mouseRepelEffectRadius.current.value &&
                isMouseEffecting
            ) {
                // Influence particles within the mouse effect radius
                particle.velocityX -= forceDirectionX * 0.2; // Increase speed by a small amount towards the cursor
                particle.velocityY -= forceDirectionY * 0.2;
                // Cap velocity
                particle.velocityX = capVelocity(particle.velocityX);
                particle.velocityY = capVelocity(particle.velocityY);
                particle.mustReturn = false;
            } else if (particle.mustReturn) {
                if (!isMouseEffecting) {
                    if (distanceToOrigin > 0.1) {
                        particle.velocityX +=
                            (particle.originalX - particle.x) * 0.01;
                        particle.velocityY +=
                            (particle.originalY - particle.y) * 0.01;
                    } else {
                        // When very close to the original position, stop the particle
                        particle.velocityX = 0;
                        particle.velocityY = 0;
                        particle.x = particle.originalX;
                        particle.y = particle.originalY;
                        particle.mustReturn = false;
                    }
                    // Apply a damping factor to smoothly stop the particle
                    particle.velocityX *= 0.8;
                    particle.velocityY *= 0.8;
                }
            }

            // Apply friction to gradually slow down particles if velocity is over 1.5
            if (Math.abs(particle.velocityX) > 1.5) {
                particle.velocityX *= 0.99;
            }
            if (Math.abs(particle.velocityY) > 1.5) {
                particle.velocityY *= 0.99;
            }

            // Move particle by its velocity
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;

            // if the particle is moving, set the isMoving flag to true
            particle.isMoving =
                Math.abs(particle.velocityX) > 0.1 ||
                Math.abs(particle.velocityY) > 0.1;

            // if the particle is moving more than a second, set the mustReturn flag to true
            if (particle.isMoving) {
                if (!particle.timer) {
                    particle.timer = setTimeout(() => {
                        particle.mustReturn = true;
                        clearTimeout(particle.timer); // Ensure the timer is cleared once used
                        particle.timer = null;
                    }, refs.particleReturnTime.current.value);
                }
            } else {
                clearTimeout(particle.timer); // Clear the timer if not moving
                particle.timer = null;
                particle.mustReturn = true;
            }
        });
    }, [
        refs.maxVelocity.current.value,
        refs.particleReturnTime.current.value,
        refs.returnRadius.current.value,
        refs.mouseRepelEffectRadius.current.value,
        refs.mouseAttractEffectRadius.current.value,
    ]);

    const drawParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.current.forEach((particle) => {
            ctx.fillStyle = refs.particleColor.current.value;
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                refs.particleSize.current.value,
                0,
                2 * Math.PI,
            );
            ctx.fill();
        });
    }, [refs.particleColor.current.value, refs.particleSize.current.value]);

    const drawOptions = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        for (const key in refs) {
            if (
                refs[key].current.display &&
                refs[key].current.type === "mouse-radius"
            ) {
                displayMouseRadius(
                    ctx,
                    mousePos.current,
                    refs[key].current.value,
                );
            }
            if (
                refs[key].current.display &&
                refs[key].current.type === "particle-radius"
            ) {
                particlesArray.current.forEach((particle) => {
                    if (particle.isMoving && !particle.mustReturn) {
                        displayParticleEndpoint(
                            ctx,
                            particle,
                            refs.returnRadius.current.value,
                        );
                    }
                });
            }
        }
    }, [refs]);

    const updateProperty = (key, delta, factor) => {
        // Safely check if key exists and refs[key] is defined
        if (refs[key] && refs[key].current !== undefined) {
            if (refs[key].current.type === "color") {
                refs[key].current.value = delta;
            } else {
                if (factor) {
                    delta *= factor;
                }
                if (refs[key].current.value + delta < 0) {
                    delta = -refs[key].current.value;
                }
                refs[key].current.value += delta;
            }
        } else {
            console.error("Key not found in refs:", key);
        }
    };

    useEffect(() => {
        prepareCanvas();
        generateParticles();

        const animate = () => {
            updateParticles();
            drawParticles();
            drawOptions();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        window.addEventListener("resize", () => {
            prepareCanvas();
            generateParticles();
        });
        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("resize", () => {
                prepareCanvas();
                generateParticles();
            });
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [
        prepareCanvas,
        generateParticles,
        updateMousePosition,
        handleMouseDown,
        handleMouseUp,
        drawParticles,
    ]);

    return (
        <>
            <ParticleBackgroundOptions
                refs={refs}
                updateProperty={updateProperty}
            />
            <canvas ref={canvasRef} className="particle-container"></canvas>
            <canvas ref={textCanvasRef} style={{ display: "none" }}></canvas>
        </>
    );
};

export default ParticleBackground;
