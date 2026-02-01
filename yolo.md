source env3/bin/activate

pip install ultralytics


[
  "plane",
  "ship",
  "storage tank",
  "baseball diamond",
  "tennis court",
  "basketball court",
  "ground track field",
  "harbor",
  "bridge",
  "large vehicle",
  "small vehicle",
  "helicopter",
  "roundabout",
  "soccer ball field",
  "swimming pool"a
]


"D:\grid5\aerialgrid\aerial1-auckland2012\1\3455\11556.jpg"

source env3/bin/activate
yolo task=obb mode=predict model=yolo26s-obb.pt source=~/grid/aerialgrid/aerial-auckland2022/1/3376/11570.jpg imgsz=1024 save=true conf=0.002 show_labels=false line_width=1 save_txt=true

yolo task=obb mode=predict model=yolo26s-obb.pt source=~/grid/aerialgrid/aerial-auckland2022/1/3392/11684.jpg imgsz=1024 save=true conf=0.02 show_labels=false line_width=1 save_txt=true

yolo task=obb mode=predict model=yolo26n-obb.pt source=~/grid/aerialgrid/aerial-auckland2022/1/3392/11684.jpg imgsz=1024 save=true conf=0.02 show_labels=false line_width=1 save_txt=true
yolo task=obb mode=predict model=yolo11n-obb.pt source=~/grid/aerialgrid/aerial-auckland2022/1/3392/11684.jpg imgsz=1024 save=true conf=0.02 show_labels=false line_width=1 save_txt=true

aerial-auckland2022\1\3376\11570.jpg"



yolo task=obb mode=predict model=yolo11n-obb.pt source=~/grid/aerialgrid/aerial-auckland2022/1/3392/11684.jpg imgsz=1024 save=true conf=0.25


sudo pacman -Syu nvidia-container-toolkit docker
sudo systemctl enable --now docker
sudo nvidia-ctk runtime configure --runtime=docker

sudo docker build -t yoltv4-modern ./docker


arch is peculiar 2026 variant of linux distro
python -m venv env4
source env4/bin/activate
pip install ultralytics
yolo task=detect mode=predict model=yolov8n.pt source=~/grid/aerialgrid/aerial-auckland2022/1/3392/11684.jpg

yolo task=detect mode=predict model=yolov8n.pt source=~/grid/aerialgrid/aerial1-auckland2012/1/3471/11500.jpg


yolo task=detect mode=predict model=yolov8n.pt source=~/grid/aerialgrid/aerial-napier2017/1/3781/10980.jpg

yolo task=detect mode=predict model=yolov8n.pt source=~/grid/aerialgrid/aerial-auckland2022/1/3425/11476.jpg
git clone https://huggingface.co/KBlueLeaf/HunYuanDiT-V1.1-fp16-pruned


 yolo task=detect mode=predict model=yolov8n.pt source=~/grid/aerialgrid/aerial1-auckland2012/1/3471/11500.jpg
Ultralytics 8.4.5 🚀 Python-3.14.2 torch-2.9.1+cu128 CPU (AMD Ryzen 5 7600 6-Core Processor)
YOLOv8n summary (fused): 72 layers, 3,151,904 parameters, 0 gradients, 8.7 GFLOPs

image 1/1 /home/skid/grid/aerialgrid/aerial1-auckland2012/1/3471/11500.jpg: 640x640 1 broccoli, 45.7ms
Speed: 2.6ms preprocess, 45.7ms inference, 0.8ms postprocess per image at shape (1, 3, 640, 640)
Results saved to /home/skid/nitrologic/onnx/runs/detect/predict
💡 Learn more at https://docs.ultralytics.com/modes/predict

(env1) [skid@archlinux onnx]$ ls -l
total 6424
-rwxr-xr-x 1 skid skid     239 Jan 18 14:23 build.sh
-rw-r--r-- 1 skid skid      71 Jan 18 14:28 content
drwxr-xr-x 7 skid skid    4096 Jan 18 13:58 HunYuanDiT-V1.1-fp16-pruned
-rw-r--r-- 1 skid skid      72 Jan 18 13:58 log.txt
-rw-r--r-- 1 skid skid    3126 Jan 18 14:26 process.cpp
drwxr-xr-x 3 skid skid    4096 Jan 18 15:17 runs
-rw-r--r-- 1 skid skid 6549796 Jan 18 15:16 yolov8n.pt

(env1) [skid@archlinux onnx]$ nano yolov8n.pt

