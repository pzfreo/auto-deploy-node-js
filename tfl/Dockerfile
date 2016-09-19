FROM alpine
RUN apk --update add python py-pip && \
	pip install --upgrade pip && \
	mkdir -p /home/root/python && \
	pip install paho-mqtt && \
	pip install httplib2 
	
ADD *.py /home/root/python/
    
WORKDIR /home/root/python/

ENTRYPOINT python tflrepub.py
