# nitrologic.github.io

Previously in [?2025Q3.md]

> Simon is back working on the sydney.skid.nz server live

EC2 instance is t3.micro with 88GB gp3 volume

In Amazon Linux 2 best pratice seems to be:

```
fallocate -l 8G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

We now cros fingers and run the fountain and the dsptool and the visual studio code remote session or 3.
