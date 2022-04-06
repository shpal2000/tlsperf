#include "tlsclient_socket.hpp"

tlsclient_socket::tlsclient_socket(bool is_udp)
                            : ev_socket (is_udp)
{
    m_ssl_init = false;
    m_app_ctx = nullptr;
    m_grp_ctx = nullptr;
    m_ssl = nullptr;
    m_bytes_read = 0;
    m_bytes_written = 0;
    m_read_error = false;
    m_write_error = false;
}

tlsclient_socket::~tlsclient_socket()
{
    if (m_ssl)
    {
        SSL_free (m_ssl);
        m_ssl = nullptr;
    }
}

bool tlsclient_socket::ssl_client_init()
{
    m_ssl = SSL_new (m_grp_ctx->m_c_ssl_ctx);

    if (m_ssl){      
        set_as_ssl_client (m_ssl);
        m_ssl_init = true;
        return true;
    }
    
    return false;
}

void tlsclient_socket::on_establish ()
{
    if (m_app_ctx->m_server_ssl)
    {
        if (m_grp_ctx->m_c_ssl_ctx && !ssl_client_init()) 
        {
            abort ();
        }
    }
}

void tlsclient_socket::on_write ()
{
    if (!m_udp)
    {
        if (m_bytes_written < m_app_ctx->m_cs_data_len)
        {
            int bytes_to_write = m_app_ctx->m_cs_data_len - m_bytes_written;

            if (bytes_to_write > m_app_ctx->m_send_buff_len)
            {
                bytes_to_write = m_app_ctx->m_send_buff_len;
            }

            write_next_data (m_app_ctx->m_send_buff
                            , 0
                            , bytes_to_write);
        } 
        else if (m_bytes_written == m_app_ctx->m_cs_data_len && m_bytes_read == m_app_ctx->m_sc_data_len)
        {
            if (m_app_ctx->m_tcp_close_type == close_reset)
            {
                abort ();
            } 
            else 
            {
                switch (m_app_ctx->m_tls_close_type)
                {
                    case close_notify_no_send:
                        write_close ();
                        break;
                    case close_notify_send:
                        write_close (SSL_SEND_CLOSE_NOTIFY);
                        break;
                    case close_notify_send_recv:
                        write_close (SSL_SEND_RECEIVE_CLOSE_NOTIFY);
                        break;
                }
            }
        }
    }
}

void tlsclient_socket::on_wstatus (int bytes_written, int write_status)
{
    if (!m_udp)
    {
        if (write_status == WRITE_STATUS_NORMAL)
        {
            m_bytes_written += bytes_written;
            
            add_tlsclient_stats(appDataBytesSent, bytes_written);

            if (m_bytes_written == m_app_ctx->m_cs_data_len && m_bytes_read == m_app_ctx->m_sc_data_len)
            {
                if (m_app_ctx->m_tcp_close_type == close_reset)
                {
                    abort ();
                } 
                else 
                {
                    switch (m_app_ctx->m_tls_close_type)
                    {
                        case close_notify_no_send:
                            write_close ();
                            break;
                        case close_notify_send:
                            write_close (SSL_SEND_CLOSE_NOTIFY);
                            break;
                        case close_notify_send_recv:
                            write_close (SSL_SEND_RECEIVE_CLOSE_NOTIFY);
                            break;
                    }
                }
            }
        }
        else
        {
            m_write_error = true;
            inc_tlsclient_stats (appDataWriteError);
            abort ();
        }
    }
}

void tlsclient_socket::on_read ()
{
    if (!m_udp)
    {
        read_next_data (m_app_ctx->m_recv_buff
                        , 0
                        , m_app_ctx->m_recv_buff_len);
    }
}

void tlsclient_socket::on_rstatus (int bytes_read, int read_status)
{
    if (!m_udp)
    {
        if (bytes_read == 0)
        {
            if (read_status == READ_STATUS_TCP_CLOSE) 
            {
                
            }
            else
            {
                this->abort();
            }
        } 
        else if (bytes_read < 0) 
        {
            m_read_error = true;
            inc_tlsclient_stats (appDataReadError);
            this->abort();
        }
        else
        {
            m_bytes_read += bytes_read;

            add_tlsclient_stats(appDataBytesRcvd, bytes_read);
        }
    }
}

void tlsclient_socket::on_error ()
{

}

void tlsclient_socket::on_finish ()
{
    if (m_bytes_written == m_app_ctx->m_cs_data_len
        && m_bytes_read == m_app_ctx->m_sc_data_len) {
        
        uint64_t mic_elapsed
            = (std::chrono::duration_cast<std::chrono::microseconds> 
                (std::chrono::system_clock::now() - this->m_tcp_init_time)).count();

        set_min_max_avg_tlsclient_stats (appDataMinLatency,
                                         appDataMaxLatency,
                                         appDataAvgLatency,
                                         mic_elapsed);
        if (m_read_error || m_write_error)
        {
            inc_tlsclient_stats (appSessionPartial);
        }
    } else {
        inc_tlsclient_stats (appSessionPartial);
    }
}
