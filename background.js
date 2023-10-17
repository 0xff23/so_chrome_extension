function incrementCounter(count) {
	console.log("incrementCounter", count);
	getLinesOfCodeCount().then((counter) => {
		chrome.storage.local.set({ counter: counter + count });
	});
}

function getLinesOfCodeCount() {
	console.log("getLinesOfCodeCount");
	return chrome.storage.local.get("counter").then((data) => {
		console.log("getLinesOfCodeCount", data);
		return data.counter ?? 0;
	});
}

chrome.commands.onCommand.addListener((command) => {
	if (command === "copy-all") {
		getCurrentTabId().then((tabId) => {
			if (tabId) {
				chrome.tabs.sendMessage(tabId, { action: "copy-all" }, (allCode) => {
					incrementCounter(lincesOfCode(allCode));
				});
			} else {
				console.error("No suitable tab found.");
			}
		});
	}
});

chrome.runtime.onMessage.addListener((req, info, callBack) => {
	if (req.action === "get-count") {
		getLinesOfCodeCount().then((counter) => {
			callBack(counter);
		});
		return true;
	}
});

function lincesOfCode(code) {
	return code.split("\n").length;
}

async function getCurrentTabId() {
	let queryOptions = { active: true, currentWindow: true, status: "complete" };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab ? tab.id : null;
}
