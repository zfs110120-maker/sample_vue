function enums(key, values, defaultValue = '') {
  if (typeof values !== 'object') {
    return defaultValue;
  }

  if (typeof values[key] != 'undefined') {
    return values[key];
  }
  else {
    return defaultValue;
  }
};

export default enums