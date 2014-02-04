#Elastic Search XBMC Movies Importer
- import the videodb.xml to an elasticsearch db.
- get "rating" from imdb
- get "pt-BR title" from imdb
- merge duplicated itens

#Instalation:

    http://www.java.com/pt_BR/download/manual.jsp#win
    http://www.elasticsearch.org/download/

##copy videodb.xml to a new folder
	
    mkdir xbmcFile
    cp {where the file is}/videodb.xml xbmcFile/

#Running

##1) importing

    node import_xbmc_xml_to_elasticsearch.js

##2) get imdb rating and pt-BR title

    node request_imdb_info.js

##3) merge duplicated

    node merge_duplicated_imdb_id.js
