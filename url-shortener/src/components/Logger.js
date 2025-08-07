let logs = [];

export const logEvent = (message) => {
  const timestamp = new Date().toISOString();
  logs.push({ timestamp, message });
};

export const getLogs = () => logs;