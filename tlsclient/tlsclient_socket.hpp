#ifndef __tlsclient_TCP_SOCKET__H
#define __tlsclient_TCP_SOCKET__H

#include "tlsclient_app.hpp"

class tlsclient_session;

class tlsclient_socket : public ev_socket
{
public:
    tlsclient_socket(bool is_udp=false);
    virtual ~tlsclient_socket();
    
    void on_establish ();
    void on_write ();
    void on_wstatus (int bytes_written, int write_status);
    void on_read ();
    void on_rstatus (int bytes_read, int read_status);
    void on_error ();
    void on_finish ();


public:
    
    tlsclient_app_ctx* m_app_ctx;
    tlsclient_grp_ctx* m_grp_ctx;

private:
    bool ssl_client_init();

private:
    bool m_ssl_init;
    SSL* m_ssl;

    int m_bytes_read;
    int m_bytes_written;
    bool m_read_error;
    bool m_write_error;
};
#endif