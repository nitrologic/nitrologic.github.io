// fileserver.ts
// deno file server for nitrologic

//import { urlParse } from 'https://deno.land/x/url_parse/mod.ts';
//import { connect } from "https://deno.land/x/redis@v0.26.0/mod.ts";

async function failRequest(filepath:string,origin:string):Promise<Response>{
	const now=new Date();
	const info=filepath+" from "+origin+" "+now.toJSON();
	console.log("failRequest "+info);
//	const poop = await redis.lpush("skidnz.fail_log",info);
//	console.log("failRequest "+info+" "+poop);
	const ignore=new Response(null,{status:444});
	return ignore;
}

export const MimeTypes:{[extension:string]:string}={
	gz:"application/octet-stream",
	bin:"application/octet-stream",
	gltf:"application/json",
	txt:"text/plain",
	xml:"text/xml",
	md:"text/markdown",
	raw:"application/octet-stream",
	json:"application/octet-stream",
	json2:"application/json",
	vox:"application/json",
	my3d:"application/json",
	html:"text/html",
	css:"text/css",
	js:"text/javascript",
	gif:"image/gif",
	png:"image/png",
	jpg:"image/jpeg",
	gles:"text/plain",
	ico:"image/x-icon"
};

const server = Deno.listen({ port: 8080 });
const RootPath = "./";

function logRobot(headers){
	console.log("robot request"+headers.get("User-Agent"));
}

console.log("deno serving files on http://localhost:8080/ from ",RootPath);

for await (const conn of server) {
	handleHttp(conn);			
}

async function handleHttp(connection: Deno.Conn) {
	const httpConnection = Deno.serveHttp(connection);
	try
	{
		for await (const requestEvent of httpConnection) {
			const request=requestEvent.request;
			const origin=request.headers.get("X-Remote")||"?";
			const url = new URL(request.url);

			let filepath = decodeURIComponent(url.pathname);


			if (filepath=="/") {
				filepath="/index.html";
			}
			if(filepath=="/favicon.ico"){
				filepath="/nitrologic.ico";
			}
			if(filepath=="/robots.txt"){
				logRobot(request.headers);
			}

			const path:string = RootPath+filepath;
			const extension = filepath.slice((filepath.lastIndexOf(".") - 1 >>> 0) + 2);
			let content:BodyInit;
			let contentLength=0;
			let contentEncoding="";
			const headers:Headers=new Headers;
			try {
//				console.log(url.pathname +" => " + filepath + " => " + path);
				const fileinfo=await Deno.stat(path);
				if(!fileinfo.isFile) throw("file not found");
				contentLength=fileinfo.size;
				if(contentLength<256){
					const file:Uint8Array = await Deno.readFile(path);
					contentLength=file.length;
					content=file;
				}else{
					const file=await Deno.open(path);
					content=file.readable;
				}
			} 
			catch(_err) 
			{
				console.log("_err caught "+path,origin);
				console.log("_err message "+_err.message);
				try{
					const ignore=await failRequest(filepath,origin);
					await requestEvent.respondWith(ignore);
				} catch(error){
					console.log("handleHttp issue respond with ignore error:",error.message,filepath,origin);
					return;
				}
				continue;
			}
			// post load exception content-type
			if(extension in MimeTypes){
//				console.log("mimeTyped extension is : "+extension);
				const mimeType=MimeTypes[extension];
				headers.append("Content-Type",mimeType);
				if(extension=="gz"){
					contentEncoding="gzip";
				}
			}else{
				console.log("No mime support for extension "+extension);			
				const ignore=await failRequest(filepath,origin);	//logs to poop
				try{
					await requestEvent.respondWith(ignore);
				} catch(error){
					console.log("handleHttp issue respond with ignore error:",error.message,filepath,origin);
					return;
				}
				continue;
			}
			if(contentEncoding){
				headers.append("Content-Encoding",contentEncoding);
			}
			headers.append("Content-Length",contentLength.toString());
			const response = new Response(content,{headers});
			try{
				await requestEvent.respondWith(response);
			} catch(error){
				console.log("handleHttp respondWith error:",error.message,filepath,origin);
				return;
			}
			try{
				const host=origin||url.host
//				const _served1 = await redis.hincrby("skidnz.served.requests", host, 1);
//				const _served2 = await redis.hincrby("skidnz.served.bytes", host, contentLength);
			} catch(error){
				console.log("handleHttp redis skidnz hincrby error:",error.message,filepath,origin);
				return;
			}
		}
	}
	catch(error)
	{
		console.log("handleHttp exception",error.message);		
	}
}
