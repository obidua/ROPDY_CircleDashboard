

export const formatTimestamp = (timestamp) => {
    const ts = Number(timestamp);
    if (!ts) return "Invalid date";
    return new Date(ts * 1000).toLocaleString();
};


