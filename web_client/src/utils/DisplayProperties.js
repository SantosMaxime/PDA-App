export const displayMouseRadius = (ctx, mousePos, radius) => {
    const numPoints = 100; // The number of points that make up the circle
    const step = (2 * Math.PI) / numPoints; // The angle step between points

    ctx.fillStyle = "black"; // Set the color of the points

    for (let angle = 0; angle < 2 * Math.PI; angle += step) {
        const x = mousePos.x + radius * Math.cos(angle); // Calculate the x coordinate
        const y = mousePos.y + radius * Math.sin(angle); // Calculate the y coordinate

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI); // Draw a small circle (point) at the calculated position
        ctx.fill();
    }
};

export const displayMouseLine = (ctx, mousePos, value) => {
    ctx.beginPath();
    ctx.moveTo(mousePos.x, mousePos.y);
    ctx.lineTo(value.x, value.y);
    ctx.stroke();
};

export const displayParticleReturnRadius = (ctx, particle, radius) => {
    ctx.fillStyle = "rgba(70,70,70,0.01)"; // Set the color of the points

    ctx.beginPath();
    ctx.arc(particle.originalX, particle.originalY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(particle.originalX, particle.originalY, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

export const displayParticleEndpoint = (ctx, particle, radius) => {
    if (!particle.velocityX && !particle.velocityY) return; // Skip if no velocity

    // Calculate direction of velocity
    const angle = Math.atan2(particle.velocityY, particle.velocityX);

    // Calculate endpoint based on direction and radius
    const endpointX = particle.originalX + radius * Math.cos(angle);
    const endpointY = particle.originalY + radius * Math.sin(angle);

    // Draw the endpoint
    ctx.fillStyle = "rgba(255, 165, 0, 0.8)"; // Orange color for visibility
    ctx.beginPath();
    ctx.arc(endpointX, endpointY, 5, 0, 2 * Math.PI); // Larger dot for visibility
    ctx.fill();
};
