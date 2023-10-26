import http from "./http.service";

export const getBlogAllPostsService = async (search: string = "") => {
  try {
    return await http.get(
      `https://cms.giftlips.com/wp-json/wp/v2/posts?_embed&orderby=date&search=${search}`
    );
  } catch ({ response }) {
    return response;
  }
};

export const getBlogFirstPostService = async () => {
  try {
    return await http.get(`/blog/posts?_embed&per_page=1&orderby=date`);
  } catch ({ response }) {
    return response;
  }
};

export const getBlogAllPostsExceptFirstPostService = async (
  offset: number = 1
) => {
  try {
    return await http.get(
      `/blog/posts?_embed&per_page=1&offset=${offset}&orderby=date`
    );
  } catch ({ response }) {
    return response;
  }
};

export const getBlogDetailPostService = async (slug: string) => {
  try {
    return await http.get(`/blog/posts?slug=${slug}&_embed`);
  } catch ({ response }) {
    return response;
  }
};
