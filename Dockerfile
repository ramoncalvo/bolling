FROM ramoncalvo2019/node-16-tmux-vim-curl-zsh

WORKDIR /app
#COPY requirements.txt ./
#RUN pip3 install --no-cache-dir -r requirements.txt
COPY ./ .

