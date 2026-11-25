const logger = {
  enabled: true,

  log(message) {
    if (this.enabled) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  },
};

export default logger;
