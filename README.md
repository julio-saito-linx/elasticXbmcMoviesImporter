#Elastic Search - Media Importer

##Instalation:

    http://www.java.com/pt_BR/download/manual.jsp#win
    http://www.elasticsearch.org/download/

### importing XBMC exported file
	follow instructions on /XBMC_importer/README.md

###copy videodb.xml to a new folder
	
    mkdir xbmcFile
    cp {where the file is}/videodb.xml xbmcFile/

##Running

###1) importing

    node import_xbmc_xml_to_elasticsearch.js

###2) get imdb rating and pt-BR title

    node request_imdb_info.js

###3) merge duplicated

    node merge_duplicated_imdb_id.js
