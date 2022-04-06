#include "tlsclient_app.hpp"
#include "tlsclient_socket.hpp"


tlsclient_app::tlsclient_app(tlsclient_cfg* cfg
                                    , tlsclient_stats* gstats)
{
    m_app_ctx.m_app_id = cfg->app_id;
    m_app_ctx.m_app_gid = cfg->app_gid;
    m_app_ctx.m_server_ssl = cfg->server_ssl;

    m_app_ctx.m_cs_data_len = cfg->cs_data_len;
    m_app_ctx.m_sc_data_len = cfg->sc_data_len;
    m_app_ctx.m_cs_starttls_len = cfg->cs_starttls_len;
    m_app_ctx.m_sc_starttls_len = cfg->sc_starttls_len;

    if (strcmp(cfg->tls_version.c_str(), "sslv3") == 0)
    {
        m_app_ctx.m_tls_version = sslv3;
    }
    else if (strcmp(cfg->tls_version.c_str(), "tls1") == 0)
    {
        m_app_ctx.m_tls_version = tls1;
    }
    else if (strcmp(cfg->tls_version.c_str(), "tls1_1") == 0)
    {
        m_app_ctx.m_tls_version = tls1_1;
    } 
    else if (strcmp(cfg->tls_version.c_str(), "tls1_2") == 0)
    {
        m_app_ctx.m_tls_version = tls1_2;
    } 
    else if (strcmp(cfg->tls_version.c_str(), "tls1_3") == 0)
    {
        m_app_ctx.m_tls_version = tls1_3;
    } 
    else
    {
        m_app_ctx.m_tls_version = tls1_2;
    }

    m_app_ctx.m_tls_cipher = cfg->tls_cipher;

    if (strcmp(cfg->tcp_close_type.c_str(), "close_fin") == 0){
        m_app_ctx.m_tcp_close_type = close_fin;
    }
    else
    {
        m_app_ctx.m_tcp_close_type = close_reset;
    }

    if (strcmp(cfg->tls_close_type.c_str(), "close_notify_send") == 0){
        m_app_ctx.m_tls_close_type = close_notify_send;
    }
    else if (strcmp(cfg->tls_close_type.c_str(), "close_notify_send_recv") == 0)
    {
        m_app_ctx.m_tls_close_type = close_notify_send_recv;
    }
    else
    {
        m_app_ctx.m_tls_close_type = close_notify_no_send;
    }

    m_app_ctx.m_resumption_count = cfg->resumption_count;

    if (strcmp(cfg->resumption_type.c_str(), "session_ticket") == 0){
        m_app_ctx.m_resumption_type = session_ticket;
    }
    else if (strcmp(cfg->resumption_type.c_str(), "session_id") == 0){
        m_app_ctx.m_resumption_type = session_id;
    }
    else if (strcmp(cfg->resumption_type.c_str(), "session_ticket_and_id") == 0){
        m_app_ctx.m_resumption_type = session_ticket_and_id;
    }
    else
    {
        m_app_ctx.m_resumption_type = session_none;
    }

    m_app_ctx.m_tcp_rcv_buff_len = cfg->tcp_rcv_buff_len;
    m_app_ctx.m_tcp_snd_buff_len = cfg->tcp_snd_buff_len;

    m_app_ctx.m_read_chunk_len = cfg->read_chunk_len;
    m_app_ctx.m_write_chunk_len = cfg->write_chunk_len;

    m_app_ctx.m_cps = cfg->cps;
    m_app_ctx.m_total_conn_count = cfg->total_conn_count;    
    m_app_ctx.m_max_active_conn_count = cfg->max_active_conn_count;

    m_app_ctx.m_recv_buff_len = m_app_ctx.m_read_chunk_len;
    m_app_ctx.m_recv_buff 
        = (char*) malloc(m_app_ctx.m_recv_buff_len);

    m_app_ctx.m_send_buff_len = m_app_ctx.m_write_chunk_len;
    m_app_ctx.m_send_buff 
        = (char*) malloc(m_app_ctx.m_send_buff_len);

    memset(m_app_ctx.m_send_buff, 'c', m_app_ctx.m_send_buff_len);

    ev_socket::set_sockaddr (&m_app_ctx.m_server_addr
                            , cfg->server_ip.c_str()
                            , htons(cfg->server_port));


    ev_socket::set_sockaddr (&m_app_ctx.m_stats_addr
                            , cfg->stats_ip.c_str()
                            , htons(cfg->stats_port));

    m_app_ctx.m_sock_opt.rcv_buff_len = m_app_ctx.m_tcp_rcv_buff_len;
    m_app_ctx.m_sock_opt.snd_buff_len = m_app_ctx.m_tcp_snd_buff_len;

    m_app_ctx.m_stats_arr.push_back(&m_stats);
    m_app_ctx.m_stats_arr.push_back(gstats);

    m_init_ok = false;

    m_grp_ctx.m_c_ssl_ctx = SSL_CTX_new(TLS_client_method());
    if (m_grp_ctx.m_c_ssl_ctx)
    {
        if (m_app_ctx.m_tls_version == sslv3) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , SSL3_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , SSL3_VERSION);
        } 
        else if (m_app_ctx.m_tls_version == tls1) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_VERSION);
        }
        else if (m_app_ctx.m_tls_version == tls1_1) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_1_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_1_VERSION);
        }
        else if (m_app_ctx.m_tls_version == tls1_2) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_2_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_2_VERSION);
        }
        else if (m_app_ctx.m_tls_version == tls1_3) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_3_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_3_VERSION);
        }
        else
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_2_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_c_ssl_ctx
                                                , TLS1_2_VERSION);
        }


        if (m_app_ctx.m_tls_version == tls1_3)
        {
            SSL_CTX_set_ciphersuites (m_grp_ctx.m_c_ssl_ctx
                                    , m_app_ctx.m_tls_cipher.c_str());

        }
        else
        {
            SSL_CTX_set_cipher_list (m_grp_ctx.m_c_ssl_ctx
                                    , m_app_ctx.m_tls_cipher.c_str());
        }

        SSL_CTX_set_mode(m_grp_ctx.m_c_ssl_ctx
                            , SSL_MODE_ENABLE_PARTIAL_WRITE);


        if (m_app_ctx.m_resumption_type == session_ticket)
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_c_ssl_ctx
                                            , SSL_SESS_CACHE_CLIENT);
        }
        else if (m_app_ctx.m_resumption_type == session_id)
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_c_ssl_ctx
                                            , SSL_SESS_CACHE_SERVER);
        }
        else if (m_app_ctx.m_resumption_type == session_ticket_and_id)
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_c_ssl_ctx
                                            , SSL_SESS_CACHE_BOTH);
        }
        else
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_c_ssl_ctx
                                            , SSL_SESS_CACHE_OFF);
        }

        SSL_CTX_set_session_id_context(m_grp_ctx.m_c_ssl_ctx
                                        , (unsigned char*)this
                                        , sizeof(void*));

        SSL_CTX_set1_groups_list(m_grp_ctx.m_c_ssl_ctx
                                    , "P-521:P-384:P-256");

        SSL_CTX_set_dh_auto(m_grp_ctx.m_c_ssl_ctx, 1);
    }

    m_app_ctx.m_stats_sock 
        = (tlsclient_socket*) new_udp_client (nullptr
                                            , &m_app_ctx.m_stats_addr
                                            , &m_app_ctx.m_stats_arr);

    if (m_grp_ctx.m_c_ssl_ctx 
        && m_app_ctx.m_stats_sock
        && m_app_ctx.m_send_buff
        && m_app_ctx.m_recv_buff)
    {
        m_init_ok = true;
    }

    m_stop = false;
    m_curr_conn_count = 0;

    char next_ip[128];
    m_app_ctx.m_clnt_addr_index = 0;
    m_app_ctx.m_clnt_addr_count = 0;
    for (auto client_ip : cfg->client_ips)
    {
        strcpy (next_ip, client_ip.c_str());
        ev_sockaddrx* next_addr = new ev_sockaddrx (5001, 65000);
        ev_socket::set_sockaddr (&next_addr->m_addr, next_ip, 0);
        m_app_ctx.m_clnt_addr_pool.push_back(next_addr);
        m_app_ctx.m_clnt_addr_count++;
    }
}


tlsclient_app::~tlsclient_app()
{
    if (m_app_ctx.m_stats_sock)
    {
        ev_socket::free_udp_client(m_app_ctx.m_stats_sock);
        m_app_ctx.m_stats_sock = nullptr;
    }  
}


void tlsclient_app::run_iter(bool tick_sec)
{
    tlspack_app::run_iter (tick_sec);

    if (tick_sec)
    {   
        int app_done = 0;
        if ( (m_curr_conn_count == m_app_ctx.m_total_conn_count) 
                                && (m_stats.tcpActiveConns == 0) 
                                && (m_stats.tcpConnInitInUse == 0) )
        {
            app_done = 1;
        }

        m_stats.tick_sec();

        json j;
        m_stats.dump_json_x (j);

        j["appId"] = m_app_ctx.m_app_id;
        j["appGId"] = m_app_ctx.m_app_gid;
        j["appDone"] = app_done;

        std::string s = j.dump();

        m_app_ctx.m_stats_sock->udp_write(
                    (const char*)s.c_str(), s.length());
    }

    if (to_new_connect())
    {
        ev_sockaddrx* next_client_addr 
            = m_app_ctx.m_clnt_addr_pool[m_app_ctx.m_clnt_addr_index];
        
        m_app_ctx.m_clnt_addr_index++;
        if (m_app_ctx.m_clnt_addr_index == m_app_ctx.m_clnt_addr_count) 
        {
            m_app_ctx.m_clnt_addr_index = 0;
        }

        if (false)
        {
            u_short port = next_client_addr->m_portq->get_port();
            if (port)
            {
                ev_socket::set_sockaddr_port(&next_client_addr->m_addr, port);

                tlsclient_socket* client_socket 
                    = (tlsclient_socket*) 
                    new_tcp_connect (&next_client_addr->m_addr
                                    , &m_app_ctx.m_server_addr
                                    , &m_app_ctx.m_stats_arr
                                    , next_client_addr->m_portq
                                    , &m_app_ctx.m_sock_opt);
                
                if (client_socket)
                {
                    m_curr_conn_count++;
                    client_socket->m_app_ctx = &m_app_ctx;
                    client_socket->m_grp_ctx = &m_grp_ctx;
                }
                else 
                {
                    next_client_addr->m_portq->return_port(port);
                    //todo stats
                }
            }
            else
            {
                //todo stats
            }
        } else 
        {
            ev_socket::set_sockaddr_port(&next_client_addr->m_addr, 0);

            tlsclient_socket* client_socket 
                = (tlsclient_socket*) 
                new_tcp_connect (&next_client_addr->m_addr
                                , &m_app_ctx.m_server_addr
                                , &m_app_ctx.m_stats_arr
                                , NULL
                                , &m_app_ctx.m_sock_opt);
            
            if (client_socket)
            {
                m_curr_conn_count++;
                client_socket->m_app_ctx = &m_app_ctx;
                client_socket->m_grp_ctx = &m_grp_ctx;
            }
            else 
            {
                //todo stats
            }
        }
    }
}

ev_socket* tlsclient_app::alloc_socket(bool is_udp)
{
    return new tlsclient_socket(is_udp);
}

void tlsclient_app::free_socket(ev_socket* ev_sock)
{
    delete ev_sock;
}

bool tlsclient_app::to_new_connect()
{
    bool n = false;

    if (not m_stop) {
        if (m_curr_conn_count == 0){
            m_conn_init_time = std::chrono::steady_clock::now ();
            n = 1;
        } else if ((m_app_ctx.m_total_conn_count == 0) 
                || (m_curr_conn_count < m_app_ctx.m_total_conn_count)){

            if ( (m_app_ctx.m_max_active_conn_count == 0) || (m_stats.tcpConnInitInUse < m_app_ctx.m_max_active_conn_count) )  {
                auto t = std::chrono::steady_clock::now();
                auto span = std::chrono::duration_cast<std::chrono::nanoseconds>
                                                (t - m_conn_init_time).count();
                uint64_t c = (m_app_ctx.m_cps * span) / 1000000000;
                if (c > m_curr_conn_count ) {
                    n = true;
                }
            }
        }
    }

    return n;
}