#ifndef __tlsserver_TCP_STATS__H
#define __tlsserver_TCP_STATS__H

#include "tlspack_app.hpp"

class tlsserver_socket;

struct tlsserver_stats_data : tlspack_app_stats
{
    virtual void tick_sec ()
    {
        tlspack_app_stats::tick_sec();
    }

    virtual void dump_json (json &j)
    {
        tlspack_app_stats::dump_json (j);
    }

    virtual void dump_json_x (json &j)
    {
        tlspack_app_stats::dump_json_x (j);
    }
    virtual ~tlsserver_stats_data() {};
};


struct tlsserver_stats : tlsserver_stats_data
{
    tlsserver_stats () : tlsserver_stats_data () {}
};

#endif