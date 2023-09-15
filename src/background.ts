export async function replaceFeed() {
  const dashboard = document.querySelector("#dashboard");

  if (!dashboard) {
    return;
  }

  const feedHtml = await fetch("https://github.com/dashboard-feed").then(
    (res) => res.text(),
  );

  const parser = new DOMParser();
  const feed = parser.parseFromString(feedHtml, "text/html");
  const feedMain = feed.querySelector("div.application-main main")!;
  dashboard.innerHTML = feedMain.innerHTML;

  const cssForOldFeed = document.createElement('style');
  cssForOldFeed.textContent = `
    .feed-content {
      max-width: none;
    }

    @media (min-width: 768px) {
      .feed-main {
        max-width: 100%;
      }
    }

    @media (min-width: 1400px) {
      .feed-main {
        max-width: calc(100% - 24px - 356px);
      }
    }
  `;
  document.head.appendChild(cssForOldFeed);
}

chrome.tabs.onUpdated.addListener(async (tabId, props, tab) => {
  if (props.status == "complete" && tab.url == "https://github.com/") {
    chrome.scripting.executeScript({
      target: { tabId },
      func: replaceFeed,
    });
  }
});
