#XBMC Movies Importer

##1) copy videodb.xml to "xbmcFile/" folder
  
    mkdir xbmcFile
    cp {where the file is}/videodb.xml xbmcFile/

##2) start importing

    node import_xbmc_xml_to_elasticsearch.js

##3) get imdb rating and pt-BR title

    node request_imdb_info.js

##4) remove duplicated

    node merge_duplicated_imdb_id.js
