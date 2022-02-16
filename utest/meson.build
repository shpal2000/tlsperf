incdirs = include_directories(['../subprojects/'])

executable('json.exe'
            , sources : [ 'json.cpp']
            , dependencies: [openssl, nlohmann_json_dep]
            , include_directories : [incdirs]
            , link_with : [ev_socklib, tlspack_applib]
            , build_rpath : '/tlspack/bin'
            , install_rpath : '/tlspack/bin'
            , install_dir : '/code/Dockerbuild'
            , install : true)