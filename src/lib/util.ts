import type { Order } from "src/types/types";

export function shuffle<T>(array: T[]) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

export function getSlugFromOrder(order: Order) {
	return btoa(order.userID) + "-" + order.timestamp;
}

export function log(message: any) {
	console.log(message);
}

export function error(message: string) {
	console.error(message);
	throw new Error(message);
}

export function loadScript(url: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = url;
		const headOrBody = document.head || document.body;
		headOrBody.appendChild(script);

		script.addEventListener("load", () => {
			if (window.google) {
				resolve();
			} else {
				reject(new Error("Script is not available"));
			}
		});

		script.addEventListener("error", () => {
			reject(new Error("Failed to load script"));
		});
	});
}

export function falsePropNames(obj: any) {
	const undef = Object.keys(obj).filter((k) => !obj[k]);
	return undef;
}

export function getCookie(name: string) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()!.split(";").shift();
}

export function getDataFromOrderSlug(slug: string) {
	return {
		userID: atob(slug.slice(0, slug.indexOf("-"))),
		timestamp: +slug.slice(slug.indexOf("-") + 1),
	};
}

export function formatHHMMSS(date: Date) {
	let hh = date.getHours();
	let mm = date.getMinutes();
	let ss = date.getSeconds();
	return [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":");
}

export function randomElem<T>(array: T[]) {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * sends a request to the specified url from a form. this will change the window location.
 * param {string} path the path to send the post request to
 * param {object} params the parameters to add to the url
 * param {string} [method=post] the method to use on the form
 */

export function post(path: string, params: Record<string, string>, method = "post") {
	// The rest of this code assumes you are not using a library.
	// It can be made less verbose if you use one.
	const form = document.createElement("form");
	form.method = method;
	form.action = path;

	for (const key in params) {
		const hiddenField = document.createElement("input");
		hiddenField.type = "hidden";
		hiddenField.name = key;
		hiddenField.value = params[key];

		form.appendChild(hiddenField);
	}

	document.body.appendChild(form);
	form.submit();
}

export function inputValidator(node: HTMLInputElement, _val: any) {
	let check = false;
	return {
		update(val: any) {
			if (check == false && val) check = true;
			else if (check) {
				node.style.outlineColor = val ? "" : "red";
				node.style.outlineStyle = val ? "" : "solid";
			}
		},
	};
}

export function numberValidator(node: HTMLInputElement, val: any) {
	let check = false;
	const initial = val;
	return {
		update(val: any) {
			if (check == false && val !== initial) check = true;
			if (check) {
				const good = typeof val == "number";
				node.style.outlineColor = good ? "" : "red";
				node.style.outlineStyle = good ? "" : "solid";
			}
		},
	};
}

export function removeElem<T>(arr: T[], elem: T) {
	arr.splice(
		arr.findIndex((e) => e === elem),
		1
	);
}

const dialogs: HTMLDivElement[] = [];
export function dialog(text: string, duration: number, fadeduration: number) {
	let div = document.createElement("div");
	const offset = dialogs.reduce((prev, cur) => prev + cur.clientHeight + 10, 0) + 10;
	dialogs.push(div);
	div.style.top = offset + "px";
	div.style.right = "10px";
	div.innerText = text;
	div.classList.add("dialog");
	document.body.appendChild(div);
	setTimeout(() => (div.style.animation = `fade-out ${fadeduration}s`), duration * 1000);
	setTimeout(() => {
		removeElem(dialogs, div);
		div.remove();
	}, (duration + fadeduration) * 1000);
}
