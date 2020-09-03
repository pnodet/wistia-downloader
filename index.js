const fetch = require('isomorphic-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

(async () => {
  const response = await fetch(
    "https://academy.planningdirty.com/courses/roadmap-for-a-career-to-strategy-leadership-live-webinar-london"
  );
  const text = await response.text();
  const dom = await new JSDOM(text);
  const h1 = dom.window.document.querySelector("h1").textContent;
  console.log(h1);

  const WistiaClass = dom.window.document.querySelector("div.wistia_embed")
    .id;
  console.log(WistiaClass);

  const 
})();