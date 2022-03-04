
#ifndef __tlsclient_TCP_CFG__H
#define __tlsclient_TCP_CFG__H

#include "tlspack_app.hpp"

struct tlsclient_cfg
{
    std::string app_id;
    std::string app_gid;
    
    std::string server_ip;
    u_short server_port;
    int server_ssl;

    std::vector<std::string> client_ips;

    std::string stats_ip;
    u_short stats_port;

    int cs_data_len;
    int sc_data_len;
    int cs_starttls_len;
    int sc_starttls_len;

    int cps;
    uint64_t total_conn_count;
    uint64_t max_active_conn_count;

    std::string tls_version;
    std::string tls_cipher;
    std::string tcp_close_type;
    std::string tls_close_type;

    int resumption_count;
    std::string resumption_type;

    int tcp_rcv_buff_len;
    int tcp_snd_buff_len;

    int read_chunk_len;
    int write_chunk_len;
};

#endif