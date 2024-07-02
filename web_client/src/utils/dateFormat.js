export const formatDate = (dateString) => {
    const [year, month, day, hour, minute, second] = [
        dateString.substring(0, 4),
        dateString.substring(4, 6),
        dateString.substring(6, 8),
        dateString.substring(8, 10),
        dateString.substring(10, 12),
        dateString.substring(12, 14),
    ];
    return new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}`,
    ).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    });
};

export const matchesDateFormat = (input) => /^\d{14}$/.test(input);
