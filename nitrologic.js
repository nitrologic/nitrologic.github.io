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
		console.log(markdown);
		
	} catch (error) {
		console.error(error.message);
	}
}

function load(){
	console.log("nitro.js helloworld");

	const url="README.md";

	getPage(url);
}
