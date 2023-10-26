var shortlink = require("shortlink");

const UidGenerator = () => {
  try {
    const uid = Math.floor(1000000 + Math.random() * 9000000);
    const encoded = shortlink.encode(uid);
    return encoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const slugify = (string) => {
  return string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

module.exports = { UidGenerator, slugify };
