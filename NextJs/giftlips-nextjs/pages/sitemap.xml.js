function generateSiteMap(posts, templates) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${process.env.NEXT_PUBLIC_FRONTEND_URL}</loc>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_FRONTEND_URL}/blog</loc>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_FRONTEND_URL}/terms-of-use</loc>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_FRONTEND_URL}/privacy</loc>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_FRONTEND_URL}/return-refund-policy</loc>
      </url>

      ${posts
        .map(({ slug }) => {
          return `<url><loc>${process.env.NEXT_PUBLIC_FRONTEND_URL}/${slug}</loc></url>`;
        })
        .join("")}

        ${templates.data
          .map(({ slug }) => {
            return `<url><loc>${process.env.NEXT_PUBLIC_FRONTEND_URL}/templates/${slug}</loc></url>`;
          })
          .join("")}
    </urlset>
 `;
}

export function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const blogsUrl = "https://cms.giftlips.com/wp-json/wp/v2/posts?_fields=slug";
  const blogsRequest = await fetch(blogsUrl);
  let posts = await blogsRequest.json();

  const totalpages = blogsRequest.headers.get("x-wp-totalpages");

  for (let index = 2; index <= totalpages; index++) {
    const blogsRequest = await fetch(`${blogsUrl}&page=${index}`);
    posts = posts.concat(await blogsRequest.json());
  }

  const templatesRequest = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/templates/all`
  );

  const templates = await templatesRequest.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts, templates);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
