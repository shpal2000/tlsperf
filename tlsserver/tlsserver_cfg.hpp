
#ifndef __tlsserver_TCP_CFG__H
#define __tlsserver_TCP_CFG__H

#include "tlspack_app.hpp"

struct tlsserver_cfg
{
    std::string app_id;
    std::string app_gid;

    std::string server_ip;
    u_short server_port;
    int server_ssl;

    std::string stats_ip;
    u_short stats_port;

    int send_recv_len;

    std::string tls_min_version;
    std::string tls_max_version;
    std::vector<std::string> cipher_list;
};

#endif