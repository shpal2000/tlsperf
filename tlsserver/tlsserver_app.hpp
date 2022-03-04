#ifndef __tlsserver_TCP_APP__H
#define __tlsserver_TCP_APP__H

#include "tlspack_app.hpp"

#include "tlsserver_cfg.hpp"
#include "tlsserver_stats.hpp"

class tlsserver_socket;

struct tlsserver_grp_ctx
{
    SSL_CTX* m_s_ssl_ctx;
};

struct tlsserver_app_ctx
{
    ev_sockaddr m_server_addr;
    ev_sockaddr m_stats_addr;
    
    ev_socket_opt m_sock_opt;
    
    std::vector<ev_sockstats*> m_stats_arr;
    
    tlsserver_socket* m_stats_sock;

    std::string m_app_id; 
    std::string m_app_gid;

    int m_server_ssl;

    int m_cs_data_len;
    int m_sc_data_len;
    int m_cs_starttls_len;
    int m_sc_starttls_len;
    
    int m_send_buff_len;
    char* m_send_buff;

    int m_recv_buff_len;
    char* m_recv_buff;

    enum_tls_version m_tls_version;
    std::string m_tls_cipher;
    enum_close_type m_tcp_close_type;
    enum_close_notify m_tls_close_type;

    int m_resumption_count;
    enum_resumption_type m_resumption_type;

    int m_tcp_rcv_buff_len;
    int m_tcp_snd_buff_len;

    int m_read_chunk_len;
    int m_write_chunk_len;
};

class tlsserver_app : public tlspack_app
{
public:
    tlsserver_app(tlsserver_cfg* cfg, tlsserver_stats* gstats);

    virtual ~tlsserver_app();

    void run_iter(bool tick_sec);
    
    ev_socket* alloc_socket(bool is_udp=false);
    
    void free_socket(ev_socket* ev_sock);

    tlsserver_stats m_stats;

    tlsserver_app_ctx m_app_ctx;
    tlsserver_grp_ctx m_grp_ctx;

    bool m_init_ok;

    tlsserver_socket* m_server_lsocket;
};


#define inc_tlsserver_stats(__stat_name) \
{ \
    for (uint i=0; i < this->get_sockstats_arr()->size(); i++) { \
        ev_sockstats* __stats_ptr = (*(this->get_sockstats_arr()))[i]; \
        ((tlsserver_stats*)(__stats_ptr))->__stat_name++; \
    } \
}

#define dec_tlsserver_stats(__stat_name) \
{ \
    for (uint i=0; i < this->get_sockstats_arr()->size(); i++) { \
        ev_sockstats* __stats_ptr = (*(this->get_sockstats_arr()))[i]; \
        ((tlsserver_stats*)(__stats_ptr))->__stat_name--; \
    } \
}

#define add_tlsserver_stats(__stat_name,__value) \
{ \
    for (uint i=0; i < this->get_sockstats_arr()->size(); i++) { \
        ev_sockstats* __stats_ptr = (*(this->get_sockstats_arr()))[i]; \
        ((tlsserver_stats*)(__stats_ptr))->__stat_name += (__value); \
    } \
}

#define sub_tlsserver_stats(__stat_name,__value) \
{ \
    for (uint i=0; i < this->get_sockstats_arr()->size(); i++) { \
        ev_sockstats* __stats_ptr = (*(this->get_sockstats_arr()))[i]; \
        ((tlsserver_stats*)(__stats_ptr))->__stat_name -= (__value); \
    } \
}

#endif