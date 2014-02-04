==elastic search XBMC Movies Importer

#Instalation:

    http://www.java.com/pt_BR/download/manual.jsp#win
    http://www.elasticsearch.org/download/

##copy videodb.xml to a new folder
	
    mkdir xbmcFile
    cp {where the file is}/videodb.xml xbmcFile/

#Running

##star importing

    node import_xbmc_xml_to_elasticsearch.js

##get imdb rating and pt-BR title

    node request_imdb_info.js

##remove duplicated

    node merge_duplicated_imdb_id.js
