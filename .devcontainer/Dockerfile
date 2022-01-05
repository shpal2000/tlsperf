FROM ubuntu:focal
ENV DEBIAN_FRONTEND=noninteractive
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN apt-get update \
    && apt-get -yq install apt-utils \
    && apt-get -yq install mongodb \
    && apt-get -yq install npm \
    && apt-get -yq install tmux \
    #
    && echo "set -g mouse on" > /home/vscode/.tmux.conf \
    && echo "set -g default-terminal 'screen-256color'" > /home/vscode/.tmux.conf \
    && echo "set -g @plugin 'tmux-plugins/tpm'" > /home/vscode/.tmux.conf \
    && echo "set -g @plugin 'tmux-plugins/tmux-resurrect'" > /home/vscode/.tmux.conf \
    && echo "set -g @plugin 'tmux-plugins/tmux-yank'" > /home/vscode/.tmux.conf \
    && echo "set -g @plugin 'tmux-plugins/tmux-copycat' " > /home/vscode/.tmux.conf \
    && echo "run '~/.tmux/plugins/tpm/tpm'" > /home/vscode/.tmux.conf \
    && echo "setw -g mode-keys vi " > /home/vscode/.tmux.conf \
    && echo "set -g base-index 1" > /home/vscode/.tmux.conf \
    && echo "setw -g pane-base-index 1" > /home/vscode/.tmux.conf \
    && echo "set -g status-justify left" > /home/vscode/.tmux.conf \
    && echo "set -g status-bg default" > /home/vscode/.tmux.conf \
    && echo "set -g status-fg colour12" > /home/vscode/.tmux.conf \
    && echo "set -g status-interval 2" > /home/vscode/.tmux.conf \
    && echo "setw -g window-status-format ' #F#I:#W#F '" > /home/vscode/.tmux.conf \
    && echo "setw -g window-status-current-format ' #F#I:#W#F '" > /home/vscode/.tmux.conf \
    && echo "setw -g window-status-format '#[fg=magenta]#[bg=black] #I #[bg=cyan]#[fg=colour8] #W '" > /home/vscode/.tmux.conf \
    && echo "setw -g window-status-current-format '#[bg=brightmagenta]#[fg=colour8] #I #[fg=colour8]#[bg=colour14] #W '" > /home/vscode/.tmux.conf \
    && echo "set -g status-left ''" > /home/vscode/.tmux.conf \
    && echo "set -g status-position bottom" > /home/vscode/.tmux.conf \
    && echo "set -g status-bg colour234" > /home/vscode/.tmux.conf \
    && echo "set -g status-fg colour137" > /home/vscode/.tmux.conf \
    && echo "set -g status-left ''" > /home/vscode/.tmux.conf \
    && echo "set -g status-right '#[fg=colour233,bg=colour241,bold] %d/%m #[fg=colour233,bg=colour245,bold] %H:%M:%S '" > /home/vscode/.tmux.conf \
    && echo "set -g status-right-length 50" > /home/vscode/.tmux.conf \
    && echo "set -g status-left-length 20" > /home/vscode/.tmux.conf \
    && echo "setw -g window-status-current-format ' #I#[fg=colour250]:#[fg=colour255]#W#[fg=colour50]#F '" > /home/vscode/.tmux.conf \
    && echo "setw -g window-status-format ' #I#[fg=colour237]:#[fg=colour250]#W#[fg=colour244]#F '" > /home/vscode/.tmux.conf \
    && echo "" > /home/vscode/.tmux.conf \
    # Verify git, process tools, lsb-release (common in install instructions for CLIs) installed
    && apt-get -yq install git iproute2 procps lsb-release \
    # Install C++ tools
    && apt-get -yq install build-essential cmake cppcheck valgrind \
    #
    && apt-get -yq install iputils-ping netcat tcpdump \
    && mv /usr/sbin/tcpdump /usr/bin/tcpdump \
    #
    && apt-get -yq install pkg-config \
    && apt-get -yq install python3-pip meson curl \
    && apt-get -yq install vim \
    && apt-get -yq install libssl-dev \
    && apt-get -yq install openssh-client sshpass net-tools \
    && apt-get -yq install iptables \
    #
    && cd / \
    && curl https://www.openssl.org/source/openssl-1.1.1d.tar.gz -o ./openssl-1.1.1d.tar.gz \
    && tar -xzvf ./openssl-1.1.1d.tar.gz \
    && cd openssl-1.1.1d \
    && ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib enable-ssl3 enable-ssl3-method \
    && make \
    && make install_sw \
    && echo "/usr/local/ssl/lib" > /etc/ld.so.conf.d/openssl-1.1.1d.conf \
    && mv /usr/bin/c_rehash /usr/bin/c_rehash.BEKUP \
    && mv /usr/bin/openssl /usr/bin/openssl.BEKUP \
    && cp /usr/local/ssl/bin/c_rehash /usr/bin/c_rehash \ 
    && cp /usr/local/ssl/bin/openssl /usr/bin/openssl \
    #
    && groupadd --gid $USER_GID $USERNAME \
    && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get install -yq sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && sudo ldconfig -v \
    #
    && pip3 install requests pytest aiohttp pymongo kubernetes\
    # Clean up
    && apt-get autoremove -yq \
    && apt-get clean -yq \
    && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=
