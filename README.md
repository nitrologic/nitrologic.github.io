# nitrologic.github.io

A homebase for the nitrologic repositories

## Serendipity

> [kia ora AWS, welcome to New Zealand](https://aws.amazon.com/blogs/aws/now-open-aws-asia-pacific-new-zealand-region/) - Simon Armstrong

The new services are opt in so from the AWS console we find something to click

<img src="media/enablenewzealand1.png" alt="drawing" width="200"/>

First click we select the Manage Regions

![enable2](media/enablenewzealand2.png)

Second click, we locate New Zealand and voila, we Enable our new home.

https://ap-southeast-6.console.aws.amazon.com/ec2/home

### Step 2 EC2 instance is cheap t3.micro with 88GB NVME

So cheap, and as of September 2025 AWS is now a local resident. :celebrate:

No more hops across the Tasman for my synth vicious audio packets...

![ping](media/pingsoutheast6.png)

Will update later in October with actual pricing, the spec remains the same.

![bits](media/awsec2bits.png)

### Step 3 8GB SWAP

The following effectively doubles our RAM making Visual Studio remote sessions reliable on the small foot print t3.micro.

```
fallocate -l 8G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Step 4 Sync grid5 geo tiles

```
rsync -az --info=progress2 /grid5 ec2-user@skid:/home/ec2-user/grid5/
```

The script must go on...

![rsync](media/sync1a.png)
![rsync](media/sync1b.png)

## Step 5 reset the nitrologic fit3 webserver

Our 2024 C++ web server project jumps back into service to attempt delivery of many bare metal pings.

```
sudo hostname -b skid
sudo systemctl start redis6
sudo service nginx start
pushd dsptool/native/bin
./fit3
#gdb -ex "set print thread-events off" -ex=run ./fit3
popd
```

## Step 6 document the DSPHost stack

Will hide the Synth Vicious project aside in order to showcase recent LLM research.

Service now intermittent at https://skid.nz


## Previously

* Fountain now responds with slop.

* bibli now has more interesting bits

* AWS EC2 instance is back sydney.nz t3.micro

Older ramblings [?2025Q3.md]
