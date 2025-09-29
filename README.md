# nitrologic.github.io

A homebase for the nitrologic repositories


## Serendipity

> [kia ora AWS, welcome to New Zealand](https://aws.amazon.com/blogs/aws/now-open-aws-asia-pacific-new-zealand-region/) - Simon Armstrong

The new services are opt in so from the AWS console we find something to click,

![enable1](media/enablenewzealand1.png)

And click,

![enable2](media/enablenewzealand2.png)

And we are home!

https://ap-southeast-6.console.aws.amazon.com/ec2/home

### EC2 instance is cheap t3.micro with 88GB NVME

So cheap, and as of September 2025 AWS is now a local resident. :celebrate:

No more hops across the Tasman for my synth vicious audio packets...

![ping](media/pingsoutheast6.png)

### 8GB SWAP

```
fallocate -l 8G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Sync grid5 geo tiles


![rsync](mesida/rsync.png)
rsync -az --info=progress2 /grid5 ec2-user@skid:/home/ec2-user/grid5/


## Previously

* Fountain now responds with slop.

* bibli now has more interesting bits

* AWS EC2 instance is back sydney.nz t3.micro

Older ramblings [?2025Q3.md]
