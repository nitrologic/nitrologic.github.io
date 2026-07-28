// refine.ts
// (c) 2026 nitrologic

// for all files in raw/
// for each line
// remove all that follow certain rule
// and store in history/

import { format } from "@std/datetime";

const epoch:number=Date.UTC(2025,4,12);

function slopmark():string{
	return Math.floor((Date.now()-epoch)/62.5).toString(16);
}

let minDate=Number.MAX_SAFE_INTEGER;
let maxDate=0;

function slopDate(sixteenths:number){
	minDate=Math.min(minDate,sixteenths);
	maxDate=Math.max(maxDate,sixteenths);
	const secs=epoch+sixteenths*62.5;
	const date=new Date(secs);
	return format(date, "yyyy-MM-dd HH:mm:ss");
}

let sessionCount=0;
let failCount=0;

const vendors={};
const models={};

// extract modelcount and connection time and add to vendor histogram
// Connected to moonshot 13 0.48s 

function parseHeader(line:string){
//	console.log(line);
	const words=line.split(" ");
// Endpoint failure for account openai
	if(words[1]=="failure"){
		const vendor=words[4];
		const stats=vendors[vendor]??{connections:0,failures:0,minTime:0,maxTime:0};
		stats.failures++;
		vendors[vendor]=stats;
		return;
	}
	if(words[0]=="Connected"&&words[1]=="to"){
		const n=words.length;
		const s=parseFloat(words[n-1]);
		const m=parseInt(words[n-2]);
		const vendor=words[n-3];
		const stats=vendors[vendor]??{connections:0,failures:0,minTime:s,maxTime:s};
		stats.minTime=Math.min(s,stats.minTime);
		stats.maxTime=Math.max(s,stats.maxTime);
		stats.connections++;
		vendors[vendor]=stats;
		return;
	}
	if(words[0]=="modifying"&&words[1]=="modelList"){
		return;
	}
	if(words[0]=="Saved"&&words[1]=="session"){
		return;
	}
	if(words[0]=="callcommand"){
		return;
	}
	if(words[0]=="added"&&words[1]=="model"){
		return;
	}
//	console.log("[parseHeader]",line);
}

async function reduce(text:string,name:string):Promise<number>{
	let count=0;
	let inHeader=false;
	let model="";
	const result=new Array<string>();  
	const lines=text.split("\n");
	for(const line of lines){
		const trim=line.trim();
		if(trim.length==0){
			count++;
			continue;
		}
		const s1=trim.indexOf(" ");
		const s2=trim.indexOf(" ",s1+1);
		const tag=trim.substring(s1+1,s2);
		const s3=trim.indexOf("[roha] [FORGE]");
		if(s3>0){
			if(!inHeader){
				inHeader=true;
				sessionCount++;
			}
			parseHeader(trim.substring(s3+14).trim());
		}else{
			inHeader=false;
		}

		if(!tag.startsWith("[") || tag=="[roha]" || tag=="[remote]" || tag=="[PORT]"){
			count++;
			continue;
		}
		if(tag=="[FAIL]"){
//			console.log(line);
			failCount++;
			continue;
		}

		const user=tag.indexOf("@")!=-1 || tag.indexOf(":")!=-1 || tag=="[stdin]" || tag=="[simon]";
		if(!user){
			const stats=models[tag]??{sessions:0,prompts:0,lines:0,recent:0};
			if(tag!=model){
				model=tag;
				stats.prompts++;
				if(stats.recent!=sessionCount){
					stats.recent=sessionCount;
					stats.sessions++;
				}
			}
			stats.lines++;
			models[tag]=stats;
		}

		const hashed=(trim.substring(s2,s2+2)==" #");
		const trim2=hashed?trim.slice(0,s2+1)+trim.slice(s2+2):trim;
		const mark=parseInt(trim2.substring(0,s1),16);
		const date=slopDate(mark);
		const line2=date+trim2.substring(s1);
		result.push(line2);
	}
	Deno.writeTextFile("history/"+name,result.join("\n"));
	return count;
}

const dir=await Deno.readDir("raw");
for await (const file of dir){
	const lines=await Deno.readTextFile("raw/"+file.name);
	let count=reduce(lines,file.name);
	console.log(file.name,lines.length,count);
}

for (const vendor in vendors) {
	if(vendors[vendor].maxTime==0) {
//		console.log("[vendor] removing ",vendor,vendors[vendor]);
		delete vendors[vendor];
	}
}

console.log("nitrologic slop fountain relay usage from",slopDate(minDate),"to",slopDate(maxDate));
console.log({sessionCount,failCount});
console.log(vendors);

const sortedModels=Object.fromEntries(Object.entries(models).sort((a, b) => b[1].sessions - a[1].sessions));
console.log(sortedModels);