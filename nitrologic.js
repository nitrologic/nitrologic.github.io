// nitrologic.js
// (C)2024 nitrologic
// ALL RIGHTS RESERVED

async function getPage(url){
	try {
		const response = await fetch(url,{headers: {"Content-Type": "text/markdown", "Accept": "text/markdown"}});
		if (!response.ok) {
		  throw new Error(`Response status: ${response.status}`);
		}
		const markdown = await response.text();
//		console.log(markdown);
		const markup = markUp(markdown);

		const div = document.getElementById("content1");
		div.innerHTML = markup;
		
	} catch (error) {
		console.error(error.message);
	}
}

function load(){
	const search=location.search;
	console.log("nitro.js helloworld"),search;
	const url=search.length?search.substring(1):"README.md";
	getPage(url);
}
