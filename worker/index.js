// Serves the static export from ./out and sends the old address
// fadehouse.twopixeldev.com to thefadehouse.twopixeldev.com (301).
const CANONICAL_HOST = "thefadehouse.twopixeldev.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
