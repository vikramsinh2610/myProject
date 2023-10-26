const WP_ENDPOINT = "https://cms.giftlips.com/wp-json";

const list = async (req, res) => {
  let urlParams = req?._parsedUrl?.search || "";
  let posts = await fetch(`${WP_ENDPOINT}/wp/v2/posts/${urlParams}`);
  const postsJson = await posts.json();
  return res.json(postsJson);
};

module.exports = {
  list,
};
