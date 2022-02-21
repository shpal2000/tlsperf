#ifndef __tlsclient_TCP_STATS__H
#define __tlsclient_TCP_STATS__H

#include "tlspack_app.hpp"

class tlsclient_socket;

struct tlsclient_stats_data : tlspack_app_stats
{
    uint64_t appDataMinLatency;
    uint64_t appDataMaxLatency;
    uint64_t appDataAvgLatency;

    virtual void tick_sec ()
    {
        tlspack_app_stats::tick_sec();
    }

    virtual void dump_json (json &j)
    {
        tlspack_app_stats::dump_json (j);
        
        j["appDataMinLatency"] = appDataMinLatency;
        j["appDataMaxLatency"] = appDataMaxLatency;
        j["appDataAvgLatency"] = appDataAvgLatency;
    }

    virtual void dump_json_x (json &j)
    {
        tlspack_app_stats::dump_json_x (j);
        
        j["adal"] = appDataAvgLatency;
    }

    virtual ~tlsclient_stats_data() {};
};


struct tlsclient_stats : tlsclient_stats_data
{
    tlsclient_stats () : tlsclient_stats_data () {}
};

#endif