#include "tlsserver_app.hpp"
#include "tlsserver_socket.hpp"


tlsserver_app::tlsserver_app(tlsserver_cfg* cfg
                                    , tlsserver_stats* gstats)
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

    m_app_ctx.m_recv_buff_len = m_app_ctx.m_read_chunk_len;
    m_app_ctx.m_recv_buff 
        = (char*) malloc(m_app_ctx.m_recv_buff_len);

    m_app_ctx.m_send_buff_len = m_app_ctx.m_write_chunk_len;
    m_app_ctx.m_send_buff 
        = (char*) malloc(m_app_ctx.m_send_buff_len);

    memset(m_app_ctx.m_send_buff, 's', m_app_ctx.m_send_buff_len);

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

    m_grp_ctx.m_s_ssl_ctx = SSL_CTX_new(TLS_server_method());
    if (m_grp_ctx.m_s_ssl_ctx)
    {
        if (m_app_ctx.m_tls_version == sslv3) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , SSL3_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , SSL3_VERSION);
        } 
        else if (m_app_ctx.m_tls_version == tls1) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_VERSION);
        }
        else if (m_app_ctx.m_tls_version == tls1_1) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_1_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_1_VERSION);
        }
        else if (m_app_ctx.m_tls_version == tls1_2) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_2_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_2_VERSION);
        }
        else if (m_app_ctx.m_tls_version == tls1_3) 
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_3_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_3_VERSION);
        }
        else
        {
            SSL_CTX_set_min_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_2_VERSION);
            SSL_CTX_set_max_proto_version (m_grp_ctx.m_s_ssl_ctx
                                                , TLS1_2_VERSION);
        }


        if (m_app_ctx.m_tls_version == tls1_3)
        {
            SSL_CTX_set_ciphersuites (m_grp_ctx.m_s_ssl_ctx
                                    , m_app_ctx.m_tls_cipher.c_str());

        }
        else
        {
            SSL_CTX_set_cipher_list (m_grp_ctx.m_s_ssl_ctx
                                    , m_app_ctx.m_tls_cipher.c_str());
        }

        SSL_CTX_set_mode(m_grp_ctx.m_s_ssl_ctx
                            , SSL_MODE_ENABLE_PARTIAL_WRITE);


        if (m_app_ctx.m_resumption_type == session_ticket)
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_s_ssl_ctx
                                            , SSL_SESS_CACHE_CLIENT);
        }
        else if (m_app_ctx.m_resumption_type == session_id)
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_s_ssl_ctx
                                            , SSL_SESS_CACHE_SERVER);
        }
        else if (m_app_ctx.m_resumption_type == session_ticket_and_id)
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_s_ssl_ctx
                                            , SSL_SESS_CACHE_BOTH);
        }
        else
        {
            SSL_CTX_set_session_cache_mode(m_grp_ctx.m_s_ssl_ctx
                                            , SSL_SESS_CACHE_OFF);
        }

        SSL_CTX_set_session_id_context(m_grp_ctx.m_s_ssl_ctx
                                        , (unsigned char*)this
                                        , sizeof(void*));

        SSL_CTX_set1_groups_list(m_grp_ctx.m_s_ssl_ctx
                                    , "P-521:P-384:P-256");

        SSL_CTX_set_dh_auto(m_grp_ctx.m_s_ssl_ctx, 1);


        const char* server_cert 
            = "/configs/cert.pem";

        const char* server_key 
            = "/configs/key.pem";

        std::ifstream f(server_cert);
        std::ostringstream ss;
        std::string str;
        ss << f.rdbuf();
        str = ss.str();

        BIO *bio = NULL;
        BIO *kbio = NULL;
        X509 *cert = NULL;
        bio = BIO_new_mem_buf((char *)str.c_str(), -1);
        cert = PEM_read_bio_X509(bio, NULL, 0, NULL);
        SSL_CTX_use_certificate (m_grp_ctx.m_s_ssl_ctx, cert);

        std::ifstream f2(server_key);
        std::ostringstream ss2;
        std::string str2;
        ss2 << f2.rdbuf();
        str2 = ss2.str();
        kbio = BIO_new_mem_buf(str2.c_str(), -1);
        EVP_PKEY *key = NULL;
        key = PEM_read_bio_PrivateKey(kbio, NULL, 0, NULL);
        SSL_CTX_use_PrivateKey(m_grp_ctx.m_s_ssl_ctx, key);

        BIO_free(bio);
        BIO_free(kbio);
        EVP_PKEY_free(key);
        X509_free(cert);

        m_server_lsocket 
            = (tlsserver_socket*) 
            new_tcp_listen (&m_app_ctx.m_server_addr
                            , 1000
                            , &m_app_ctx.m_stats_arr
                            , &m_app_ctx.m_sock_opt);
        
        m_server_lsocket->m_app_ctx = &m_app_ctx;
        m_server_lsocket->m_grp_ctx = &m_grp_ctx;
    }

    m_app_ctx.m_stats_sock 
        = (tlsserver_socket*) new_udp_client (nullptr
                                            , &m_app_ctx.m_stats_addr
                                            , &m_app_ctx.m_stats_arr);

    if (m_grp_ctx.m_s_ssl_ctx 
        && m_server_lsocket
        && m_app_ctx.m_stats_sock
        && m_app_ctx.m_send_buff
        && m_app_ctx.m_recv_buff)
    {
        m_init_ok = true;
    }
}


tlsserver_app::~tlsserver_app()
{
    if (m_app_ctx.m_stats_sock)
    {
        ev_socket::free_udp_client(m_app_ctx.m_stats_sock);
        m_app_ctx.m_stats_sock = nullptr;
    }  
}


void tlsserver_app::run_iter(bool tick_sec)
{
    tlspack_app::run_iter (tick_sec);

    if (tick_sec)
    {
        m_stats.tick_sec();
        
        json j;
        m_stats.dump_json_x (j);

        j["appId"] = m_app_ctx.m_app_id;
        j["appGId"] = m_app_ctx.m_app_gid;
        j["appDone"] = 0;

        std::string s = j.dump();

        m_app_ctx.m_stats_sock->udp_write(
                    (const char*)s.c_str(), s.length());
    }
}

ev_socket* tlsserver_app::alloc_socket(bool is_udp)
{
    return new tlsserver_socket(is_udp);
}

void tlsserver_app::free_socket(ev_socket* ev_sock)
{
    delete ev_sock;
}
