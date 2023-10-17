const preElements = document.querySelectorAll("pre");

[...preElements].forEach((preElm) => {
	const root = document.createElement("div");
	root.style.position = "relative";

	const shadowRoot = root.attachShadow({ mode: "open" });
	const cssURL = chrome.runtime.getURL("content-script.css");

	shadowRoot.innerHTML = `<link rel="stylesheet" href="${cssURL}"</link>`;

	const button = document.createElement("_copy_button");
	button.innerText = "Copy";
	button.type = "button";

	shadowRoot.prepend(button);

	preElm.prepend(root);

	const codeElm = preElm.querySelector("code");

	button.addEventListener("click", () => {
		navigator.clipboard.writeText(codeElm.innerText).then(() => {
			notify();
			callBack(codeElm.innerText);
		});
	});
});

chrome.runtime.onMessage.addListener((req, info, callBack) => {
	if (req.action === "copy-all") {
		const allCode = getAllCode();
		navigator.clipboard.writeText(allCode).then(() => {
			notify();
			callBack(allCode);
		});
		return true;
	}
});

function getAllCode() {
	return [...preElements]
		.map((preElm) => {
			return preElm.querySelector("code").innerText;
		})
		.join("");
}

function notify() {
	const scriptElement = document.createElement("script");
	scriptElement.src = chrome.runtime.getURL("execute.js");

	document.body.appendChild(scriptElement);

	scriptElement.onload = () => {
		scriptElement.remove();
	};
}
