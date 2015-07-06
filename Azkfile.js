systems({
  elasticDatabase: {
    depends: [],
    image: {docker: 'library/elasticsearch:latest'},
    shell: '/bin/bash',
    command: 'elasticsearch -Des.http.cors.enabled=true -Des.config=/#{system.name}/yml/elasticsearch.yml',
    mounts: {
      '#{system.name}' : path('.'),
      '/data' : persistent('#{system.name}/data'),
    },
    ports:{
      http: '9200/tcp',
      portB: '9300:9300/tcp',
    },
    wait: {retry: 20, timeout: 1000},
    scalable: {default: 1},
    http: {
      domains: ['#{system.name}.#{azk.default_domain}']
    }
  }
});
