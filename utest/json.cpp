
#include <nlohmann/json.hpp>
using json = nlohmann::json;

#include <stdint.h>
#include <errno.h>
#include <unistd.h>
#include <openssl/ssl.h>
#include <openssl/err.h>
#include <openssl/x509.h>
#include <openssl/pem.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <queue>
#include <cstring>
#include <string>
#include <thread>
#include <chrono>
#include <map>
#include <random>
#include <inttypes.h>
#include <signal.h>

int main(int /*argc*/, char ** argv)
{
    const char* json_file = argv[1];

    std::ifstream json_stream(json_file);
    json test_json = json::parse(json_stream);

    std::vector<std::string> client_ips;

    auto cip_list = test_json["client_ips"];
    for (auto it = cip_list.begin(); it != cip_list.end(); ++it)
    {
        auto client_ip = it.value ();
        client_ips.push_back (client_ip.get<std::string>());

        std::cout << client_ip.get<std::string>();
    }

    return 0;
}