export async function replaceFeed() {
  const dashboard = document.querySelector("#dashboard");

  if (!dashboard) {
    return;
  }

  const feedHtml = await fetch("https://github.com/dashboard-feed").then(
    (res) => res.text()
  );

  const parser = new DOMParser();
  const feed = parser.parseFromString(feedHtml, "text/html");
  const feedMain = feed.querySelector("div.application-main main")!;
  dashboard.innerHTML = feedMain.innerHTML;
}

chrome.tabs.onUpdated.addListener(async (tabId, props, tab) => {
  if (props.status == "complete" && tab.url == "https://github.com/") {
    chrome.scripting.executeScript({
      target: { tabId },
      func: replaceFeed,
    });
  }
});
