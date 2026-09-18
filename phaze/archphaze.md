# arch phaze

before switching from model of the day gemini flash, we feed it a large amount of arch journal, not this much:

> journalctl --no-pager > journal.txt

<img src="https://nitrologic.github.io/phaze/lastquarter.png" width="66%"/>


## hey Konsole, why don't you have an about menu item?

and who do i blame for the holes in the retina your design choices have cratered?

who who

<img src="https://nitrologic.github.io/phaze/cmusbash.png" width="66%"/>


## oops, am seriously impressed

locating reverse gear......

and engage, share removed, logs checked

confirm file contents not shared in nitrologic relay logs

## free slop

without login openai will happily lie slop aka reply like it is 2024

<img src="https://nitrologic.github.io/phaze/freeslop.png" width="66%"/>

## unreadable gallery

a combination of Arch arcanery and or "Code - OSS"

a simple ls command optically borked aka broken

<img src="https://nitrologic.github.io/phaze/unreadablegreen.png" width="66%"/>

## multihead main driver, what was he thinking

wow, so all the threads all the time aka pegged CPU

> this kind of cpu abuse means search index and anyone else can literally stall desktop aka system denial

<img src="https://nitrologic.github.io/phaze/wastemoreyes.png" width="66%"/>

with new bunny skills from recent alibaba hosting its desktop server with bunny cdn

<img src="https://nitrologic.github.io/phaze/5cbunny.png" width="66%"/>

some teething problems setting up roa hosting

* this one solved after complete memory lapse

* another issue involving json from json.gz at the gateway yet to be resolved 

* (edit) and another issue..
```
HttpTaskCount++ : 1
parseJSON unexpected : while parsing array
./host.sh: line 4:  7385 Segmentation fault         (core dumped) ./fit3
~
[skid@archlinux ~]$ ./host.sh 
```

## personal c++ may be fragile

> and this is getting a tad personal, skid.nz current state is sandbox dump site

```
(gdb) bt
#0  0x000055555556b847 in JSValue::stringMember (this=this@entry=0x0, name="id") at /home/skid/nitrologic/dsptool/native/json.h:208
#1  0x00005555555782d6 in parseRPC (header=std::map with 10 elements = {...}, 
    content="------WebKitFormBoundaryN**sTongueMy****\r\nContent-Disposition: form-data; name="0"\r\n\r\n{"then":"$1:proto:then","status":"resolved_model","reason":-1,"value":"{\"then\":\"$B1337\"}","_response":{"...) at /home/skid/nitrologic/dsptool/native/headless.h:821
#2  0x000055555558c701 in HttpConnection::onRequest (this=this@entry=0x5555560fa250) at /usr/include/c++/16/bits/stl_tree.h:1353
#3  0x000055555557a7a8 in httpTask (args=0x5555560fa250) at /home/skid/nitrologic/dsptool/native/http.h:371
#4  0x00007ffff70980a2 in start_thread (arg=<optimized out>) at pthread_create.c:454
#5  0x00007ffff712080c in GI_clone3 () at ../sysdeps/unix/sysv/linux/x86_64/clone3.S:78
```

<img src="https://nitrologic.github.io/phaze/doh.png" width="66%"/>

looking forward to dusting off project roa

<img src="https://nitrologic.github.io/phaze/3767_10966.jpg" width="66%"/>



## previously

* [dayone](../dayonearch.md)

* [daze](../daze/archdaze.md)
