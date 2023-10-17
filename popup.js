chrome.runtime.sendMessage({ action: "get-count" }, (count) => {
	render({ count });
});

const title = document.querySelector("h1");

function render({ count }) {
	title.innerHTML = `Lines of code: ${count}`;
}
