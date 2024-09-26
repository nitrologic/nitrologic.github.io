// markup.js
// (C)2024 nitrologic
// ALL RIGHTS RESERVED

// https://datatracker.ietf.org/doc/html/rfc4180

const github_href='/github';

function csvHTML(lines){
	var html="<table><tbody>";
	var rows=[];
	var count=0;
	var values=[];
	var inquote=false;
	var cell="";
	for(var line of lines){
		var i=0;
		while(i<line.length){
			var c=line[i++];
			if(cell.length==0 && c=='"'){
				inquote=true;
				continue;
			}else{
				if(inquote){
					if(c=='"'){
						if(line[i]=='"'){
							i++;
							cell=cell+'"';
						}else{
							inquote=false;
						}
						continue;
					}
				}else{
					if(c==','){
						values.push(cell);
						cell="";
						continue;
					}
				}				
			}
			cell+=c;
		}
		if(inquote){
			cell+="<br>";				
		}else{
			if(cell.length){
				values.push(cell);
				cell="";
			}
			rows.push(values);
			if(values.length>count) count=values.length;
			values=[];
		}
	}
	for(var row of rows){
		html+="<tr>";
		for(var i=0;i<count;i++){
			if(i<row.length){
				var value=row[i];
				html+="<td>"+value+"</td>"
			}else{
				html+="<td></td>"
			}
		}
		html+="</tr>";
	}
	html+="</tbody></table>";
	return html;
}

const escapeHTML = str => str.replace(/[&<>'"]/g, 
	tag => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		"'": '&#39;',
		'"': '&quot;'
	}[tag]));


// macro keys '²⁰²¹.³'

function escapeChars(text){
	while(true){
		var index=text.indexOf("&#");
		if(index==-1) return text;
		var term=text.indexOf(";",index);
		if(term==-1) return text;
		var form=text[index+2];
		var ref="";
		if(form=='x'||form=="X"){
			var hex=text.substring(index+3,term);
			ref=parseInt(hex,16);
		}
		if(form>='0'&&form<='9'){
			var dec=text.substring(index+2,term);
			ref=parseInt(dec,10);
		}
		var charCode=String.fromCharCode(ref);
		text=text.substring(0,index)+charCode+text.substring(term+1);
	}
	return text;
}

function markdownHeaders(cells,dashes){
	var html="<tr>";
	var n=cells.length;
	for(var i=0;i<n;i++){
		var cell=cells[i];
		var dash=dashes[i];
		html+="<th>"+markdownLine(cell)+"</th>\n";
	}
	html+="</tr>\n";
	return html;
}

function markdownCells(cells){
	var html="<tr>";
	for(var cell of cells){
		html+="<td>"+markdownLine(cell)+"</td>\n";
	}
	html+="</tr>\n";
	return html;
}


function markdownLine(line){
	let tabindex=1;
	let buffer='';
	let depth=0;
	let hash=0;
	while(line[0]=='#'){
		hash++
		line=line.substring(1);
	}
	line=']'+line;
	const s1=line.split('[');
	for(const i in s1){
		const s=s1[i];
		const split=s.split(']');	
		const blob=split[0];
		if(blob==''){
			depth++;
		}else{
			depth--;
//			let code='<pre>' + escape(blob) + '</pre><br>';
			let code='';
			const split2=blob.split(' ');
			const type=split2[0];
			const path=split2[1];
			if(!path){
				let name=blob;
				let href='';
				if (name.startsWith("https:")){
					href=name;
					code='<a href="'+href+'" target="blank">'+name+'</a>';
				}else if (name.startsWith("/#")){
					// yuck - expand local anchors to json arrays
					href="/#["+name.substring(2)+"]";
					code='<a href="'+href+'" target="_self">'+name+'</a>';
				}else{
					href='/doc/'+name.split('-').join('').toLowerCase();
					name=name.split('-').join(' ');
					code='<a href="'+href+'">'+name+'</a>';
				}
			}else{
				const url=escape(path);
				switch(type){
					case 'connect':
						switch(path){
							case 'github':
								code='login <a href="'+github_href+'">github login</a>';
								break;
							case 'position':
								code='<button onclick="return readPosition();"}>read position</button>';
								break;
							case 'orientation':
								code='<button onclick="return readOrientation();"}>read orientation</button>';
								break;
							case 'motion':
								code='<button onclick="return readMotion();"}>read motion</button>';
								break;
							}
						break;
					case 'svg':
						code='<div class="svg" id="'+path+'" tabindex="'+(tabindex++)+'"></div>'
						break;
					case 'app':
						code='<canvas app></canvas>'
						break;
					case 'map':
						code='<div map id="'+path+'" onfocus="return onMapFocus(event);" tabindex="'+(tabindex++)+'"></div>'
						break;
					case 'screen':{
						const id=path;
						split2.shift();
						if(split2.length){
							const path=split2[split2.length-1];
							if(path.startsWith('/')||path.startsWith('https:')){
								split2.pop;
								split2.push('uri="'+path+'"');
							}
						}
						const attributes=split2.join(' ');
						code='<div screen '+attributes+' id="'+id+'" onfocus="return onScreenFocus(event);" tabindex="'+(tabindex++)+'"></div>'	
						}break;
					case 'image':{
						const large=split2[2]||'';
						code='<img '+large+' src="'+url+'">';
						}break;
					case 'audio':{
						const large=split2[2]||'';
						if(path.startsWith('https:')||path.startsWith('/')){
							code='<audio controls src="'+url+'"></audio>';
						}else{
							switch(url){
								case "microphone":
									code='<audio controls muted mic name="'+url+'"></audio>';
									break;
								case "synth":
									code='<audio controls synth id="'+url+'"></audio>';
									break;
							}
						}
						code='<div player>'+code+'</div>';
						}break;
					case 'video':
						if(path.startsWith('https:')){
							code='<video controls src="'+url+'"></video>';
						}else{
							switch(url){
								case "camera":
									code='<video camera muted controls name="'+url+'"></video>';
								break;
							}
						}
						code='<div player>'+code+'</div>';
						break;
					case 'pdf':
//						code='<embed src="'+url+'" width="600" height="500" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html">';
						code='<object pdf data="'+url+'"><a href="'+url+'">Download PDF</a></object>';
						break;
					case 'media':
						code='<media controls src="'+url+'"></media>';
						break;
					case 'sequence':
						code='<media controls src="'+url+'"></media><a href="'+url+'">click</a>';
						break;
					case 'youtube2':{
						const t=split2[2]||'0';
						code='<iframe src="https://www.youtube.com/embed/'+url+'?start='+t+'" frameborder="0" allowfullscreen></iframe>';
						}break;
				}
			}
			buffer=buffer.concat(code)
		}
		const raw=split[1];
		if(raw){
			let content=escapeHTML(raw);
			content=markTags(content,'**','<strong>','</strong>');
			content=markTags(content,'__','<strong>','</strong>');
			content=markTags(content,'*','<em>','</em>');
			content=markTags(content,'_','<em>','</em>');
			if(hash){
				content='<h'+hash+'>'+content+'</h'+hash+'>';
			}
			buffer=buffer.concat(content);
		}else{
//			buffer=buffer.concat("<br>");
		}
	}
	return buffer;
}

// copilot was here with odd check...

function markTags(raw,sep,pre,post){
	var bits=raw.split(sep);
	if(bits.length>1){
		raw=""
		for(var i=0;i<bits.length-1;i+=2){
			raw+=bits[i]+pre+bits[i+1]+post;
		}
	}
	// Include the last part if the number of parts is odd
	if (bits.length&1) {
		raw += bits[bits.length - 1];
	}	
	return raw;
}

function markUp(md){
	var lines=md?md.split("\n"):[""];
	var html="";
	var incode=false;
	var fenced=false;
	var lang="";
	var intable=false;
	var header=null;
	var pre=[];
	var latex={};
	for(var line of lines){
		var fence=line.startsWith("```")
		if (fenced){
			if(fence){
				switch(lang){
					case "latex":
						var tex=pre.join(" \\\\\n");
						var markup = katex.renderToString(tex, {throwOnError: false, displayMode:true});
						html+=markup;
						break;	
					case "csv":
						html+=csvHTML(pre);
						break
					case "html":
						html+=pre.join("\n");
						break;
					default:
						var raw=escapeHTML(pre.join("\n"));
						html+="<pre>"+raw+"</pre>";
				}
				pre=[];
				fenced=false;
			}else{
				pre.push(line);
			}
			continue;
		}else{
			if(fence){
				lang=line.substring(3);
				fenced=true;
				continue;
			}
		}
		var dented=line.startsWith('\t') || line.startsWith("    ");
		if(dented){
			if(!incode){					
				html+="<pre>\n";
				incode=true;
			}
			html+=line+"\n";
		}else{
			if(incode){
				html+="</pre>\n";
				incode=false;
			}
			var cells=line.split('|');
			if(cells.length>1){
				if(!intable){
					html+="<table>";
					intable=true;
					header=cells;
					continue;						
				}
				if(header){
					var dashes=cells[0].includes('---');
					if(dashes){
						html+="<thead>";
						html+=markdownHeaders(header,dashes);
						html+="</thead><tbody>";
						header=null;
						continue;
					}else{
						html+="<tbody>";
						html+=markdownCells(header);
					}
					header=null;
				}
				html+=markdownCells(cells);
			}else{
				if(header){
					html+=markdownCells(header);
					header=null;
				}
				if(intable){
					html+="</tbody></table>"
					intable=false;
				}
				html+=markdownLine(line);
			}
		}
	}
	return html;
}
