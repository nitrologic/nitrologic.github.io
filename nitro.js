// nitro.js

async function getPage(url){
	try {
		const response = await fetch(url);
		if (!response.ok) {
		  throw new Error(`Response status: ${response.status}`);
		}
		const json = await response.json();
		console.log(json);
		
	} catch (error) {
		console.error(error.message);
	}
}

function load(){
	console.log("nitro.js helloworld");

	const url="README.md";

	getPage(url);
}
