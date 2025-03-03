const responseLogger = (req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    console.log('Response being sent:', data);
    return originalJson.call(this, data);
  };
  next();
};

module.exports = responseLogger;