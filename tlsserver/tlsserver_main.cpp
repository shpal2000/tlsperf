
#include "tlsserver_app.hpp"

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

    tlsserver_cfg app_cfg;
    tlsserver_stats app_gstats;

    app_cfg.app_id = cfg_json["app_id"].get<std::string>();
    app_cfg.app_gid = cfg_json["app_gid"].get<std::string>();

    app_cfg.server_ip = cfg_json["server_ip"].get<std::string>();
    app_cfg.server_port = cfg_json["server_port"].get<int>();
    app_cfg.server_ssl = cfg_json["server_ssl"].get<int>();

    app_cfg.stats_ip = cfg_json["stats_ip"].get<std::string>();
    app_cfg.stats_port = cfg_json["stats_port"].get<int>();

    app_cfg.send_recv_len = cfg_json["send_recv_len"].get<int>();

    app_cfg.tls_min_version = cfg_json["tls_min_version"].get<std::string>();
    app_cfg.tls_max_version = cfg_json["tls_max_version"].get<std::string>();

    auto cipher_list = cfg_json["cipher_list"];
    for (auto it = cipher_list.begin(); it != cipher_list.end(); ++it)
    {
        auto cipher = it.value ();
        app_cfg.cipher_list.push_back (cipher.get<std::string>());
    }

    tlsserver_app* tcpApp 
        = new tlsserver_app(&app_cfg, &app_gstats);

    app_list.push_back(tcpApp);
    stats_list.push_back(&app_gstats);

    tlspack_app::RunLoop(&app_list, &stats_list);


    return 0;
}