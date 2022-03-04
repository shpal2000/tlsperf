
#include "tlsclient_app.hpp"

#include <nlohmann/json.hpp>
using json = nlohmann::json;

int main(int /*argc*/, char ** /*argv*/)
{
    signal(SIGPIPE, SIG_IGN);

    const char* cfg_file = "/configs/config.json";

    std::ifstream cfg_stream(cfg_file);
    json cfg_json = json::parse(cfg_stream);

    std::vector<tlspack_app*> app_list;
    std::vector<tlspack_app_stats*> stats_list;

    tlsclient_cfg app_cfg;
    tlsclient_stats app_gstats;

    app_cfg.app_id = cfg_json["app_id"].get<std::string>();
    app_cfg.app_gid = cfg_json["app_gid"].get<std::string>();

    app_cfg.server_ip = cfg_json["server_ip"].get<std::string>();
    app_cfg.server_port = cfg_json["server_port"].get<int>();
    app_cfg.server_ssl = cfg_json["server_ssl"].get<int>();

    auto cip_list = cfg_json["client_ips"];
    for (auto it = cip_list.begin(); it != cip_list.end(); ++it)
    {
        auto client_ip = it.value ();
        app_cfg.client_ips.push_back (client_ip.get<std::string>());
    }

    app_cfg.stats_ip = cfg_json["stats_ip"].get<std::string>();
    app_cfg.stats_port = cfg_json["stats_port"].get<int>();

    app_cfg.cs_data_len = cfg_json["cs_data_len"].get<int>();
    app_cfg.sc_data_len = cfg_json["sc_data_len"].get<int>();
    app_cfg.cs_starttls_len = cfg_json["cs_starttls_len"].get<int>();
    app_cfg.sc_starttls_len = cfg_json["sc_starttls_len"].get<int>();

    app_cfg.cps = cfg_json["cps"].get<int>();
    app_cfg.total_conn_count = cfg_json["total_conn_count"].get<int>();
    app_cfg.max_active_conn_count = cfg_json["max_active_conn_count"].get<int>();


    app_cfg.tls_version = cfg_json["tls_version"].get<std::string>();
    app_cfg.tls_cipher = cfg_json["tls_cipher"].get<std::string>();
    app_cfg.tcp_close_type = cfg_json["tcp_close_type"].get<std::string>();
    app_cfg.tls_close_type = cfg_json["tls_close_type"].get<std::string>();

    app_cfg.resumption_count = cfg_json["resumption_count"].get<int>();
    app_cfg.resumption_type = cfg_json["resumption_type"].get<std::string>();

    app_cfg.tcp_rcv_buff_len = cfg_json["tcp_rcv_buff_len"].get<int>();
    app_cfg.tcp_snd_buff_len = cfg_json["tcp_snd_buff_len"].get<int>();

    app_cfg.read_chunk_len = cfg_json["read_chunk_len"].get<int>();
    app_cfg.write_chunk_len = cfg_json["write_chunk_len"].get<int>();

    tlsclient_app* tcpApp 
        = new tlsclient_app(&app_cfg, &app_gstats);

    app_list.push_back(tcpApp);
    stats_list.push_back(&app_gstats);

    tlspack_app::RunLoop(&app_list, &stats_list);


    return 0;
}