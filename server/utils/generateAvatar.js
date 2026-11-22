const generateAvatar = (name) => {
  return `https://avatar.iran.liara.run/username?username=${encodeURIComponent(name)}`;
};

module.exports = generateAvatar;
