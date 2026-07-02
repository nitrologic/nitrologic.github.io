// heatmap.ts

import { expandGlob } from "https://deno.land/std/fs/mod.ts";

export async function globFiles(pattern: string): Promise<string[]> {
	const pathsIterable = expandGlob(pattern);
	const sortList: { path: string; time: number }[] = [];
	for await (const entry of pathsIterable) {
		const path=entry.path;
		const stats = await Deno.stat(path);
		const time=stats.birthtime?.getTime();
		sortList.push({path,time});
	}
	sortList.sort(function(a, b) {return a.time - b.time;});
	const sortedPaths: string[] = [];
	for (const item of sortList) {
		sortedPaths.push(item.path);
	}
	return sortedPaths;
}

// loads all .log files from ../raw and for each line
// valid lines begin with "slopmark [id] "
// 1aba51fe [roha] [FORGE] Endpoint failure for account alibaba
// accumulate a daily heat map 

// slopmark() - returns a hex timestamp
// - hexadecimal encoding of sixteenths of a second since 2025.4.12
// - replaces new Date().toISOString() as standard timestampe in slopfountain

// first day of roha slop fountain relay project - May 12 2025

const epoch:number=Date.UTC(2025,4,12);

function daysSinceEpoch(slopmarkHex: string): number {
	const sixteenths = parseInt(slopmarkHex, 16);
	const sixteenthsPerDay = 16 * 86400; // 1,382,400
	return Math.floor(sixteenths / sixteenthsPerDay);
}

function slopmark():string{
	return Math.floor((Date.now()-epoch)/62.5).toString(16);
}

function slopDate(sixteenths:number){
	const secs=epoch+sixteenths*62.5;
	const date=new Date(secs);
	return date.toDateString();
}

let lineCount=0;
let hosts={};
let firstDay=0x4000;
let lastDay=0;
let heatDays={};

async function parseLog(path){
	const text=await Deno.readTextFile(path);
	const lines=text.split("\n");
	for(const line of lines){
		if(line.length>20){
			const i=line.indexOf(" [");
			if(i==8){
				const ii=line.indexOf("]",i+2);
				if(ii>i+2){
					const tag=line.substring(i+2,ii);
					const hex=line.substring(0,8);
					const secs=parseInt(hex,16);
					if(Number.isNaN(secs)) continue;
					const date=slopDate(secs);
					lineCount++;
					if(!(tag in hosts)){
						hosts[tag]={
							secs,
							count:0
						};
					}
					hosts[tag].count++;
					const day=daysSinceEpoch(hex);
					if (day<firstDay) firstDay=day;
					if (day>lastDay) lastDay=day;
					if(!(day in heatDays)){
						heatDays[day]={
							day,
							count:0
						}
					}
					heatDays[day].count++;
//					console.log(tag,hex,secs,date);
				}
			}
		}
	}

}

const glob="../raw/*.log";

const files=await globFiles(glob);
for(const file of files){
	console.log(file);
	await parseLog(file);
}
const blankTile="⚪";
const heatTiles=["⚫","🟤","🟣","🟢","🔵","🟡","🟠","🔴","⚪"];

function printHeatMap(heatDays: Record<number, { day: number; count: number }>,firstDay: number,lastDay: number, tiles:string[]): void {
	const counts = Object.values(heatDays).map(d => d.count);
	const maxCount = Math.max(...counts, 1);
	function getChar2(count: number): string {
		let index=((count*8)/maxCount)|0;
		if(index>7) index=7;
		if(index<0) index=0;
		return tiles[index];
	}
	function getChar(count: number): string {
        const normalized = Math.sqrt(count) / Math.sqrt(maxCount);
        let index = Math.floor(normalized * (tiles.length - 1));
        if (index >= tiles.length) index = tiles.length - 1;
        if (index < 0) index = 0;	
		return tiles[index];
	}

	if(true){
		// Build cols for each week
//		const rows: string[][] = [["⚪"],["⚪"],["⚪"],["⚪"],["⚪"],["⚪"],["⚪"]];
		const rows: string[][] = [[],[],[],[],[],[],[]];
		for (let day = firstDay; day <= lastDay; day++) {
			const dayOfWeek = day % 7; // 0=Mon, 6=Sun
			const weekIndex = ((day-dayOfWeek) / 7)|0;
			const entry = heatDays[day];
			const count = entry ? entry.count : 0;
			rows[dayOfWeek][weekIndex]=getChar(count,tiles);
		}
		let grid=[];
		for(let day=0;day<7;day++){
			let line=rows[day].join("");
			grid.push(line);
		}
		console.log(grid.join("\n"));
	}else{
		// Build rows for each week
		const rows: string[][] = [];
		for (let day = firstDay; day <= lastDay; day++) {
			const weekIndex = Math.floor(day / 7);
			const dayOfWeek = day % 7; // 0=Mon, 6=Sun
			if (!rows[weekIndex]) {
				rows[weekIndex] = new Array(7).fill(blankTile);
			}
			const entry = heatDays[day];
			const count = entry ? entry.count : 0;
			rows[weekIndex][dayOfWeek]=getChar(count,tiles);
		}
		console.log(rows.join("\n"));
	}

}

printHeatMap(heatDays, firstDay, lastDay, heatTiles);
const count=Object.keys(hosts).length;
const dayCount=Object.keys(heatDays).length;
console.log(slopmark(),"[heatmap] lines:",lineCount," hosts:",count," dayCount:",dayCount);
