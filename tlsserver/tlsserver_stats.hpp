#ifndef __tlsserver_TCP_STATS__H
#define __tlsserver_TCP_STATS__H

#include "tlspack_app.hpp"

class tlsserver_socket;

struct tlsserver_stats_data : tlspack_app_stats
{
    uint64_t appDataBytesSent;
    uint64_t appDataBytesRcvd;
    uint64_t appSessionPartial;

    virtual void tick_sec ()
    {
        tlspack_app_stats::tick_sec();
    }

    virtual void dump_json (json &j)
    {
        tlspack_app_stats::dump_json (j);
    
        j["appDataBytesSent"] = appDataBytesSent;
        j["appDataBytesRcvd"] = appDataBytesRcvd;
        j["appSessionPartial"] = appSessionPartial;
    }

    virtual void dump_json_x (json &j)
    {
        tlspack_app_stats::dump_json_x (j);

        j["adbs"] = appDataBytesSent;
        j["adbr"] = appDataBytesRcvd;
        j["asprt"] = appSessionPartial;
    }
    
    virtual ~tlsserver_stats_data() {};
};


struct tlsserver_stats : tlsserver_stats_data
{
    tlsserver_stats () : tlsserver_stats_data () {}
};

#endif