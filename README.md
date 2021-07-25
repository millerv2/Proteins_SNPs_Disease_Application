# Proteins_SNPs_Disease_Application
Web-application for exploring rare coding SNPs associated with a disease. Single page, AJAX-based, CouchDB backend.

## Data Sources (Provided):
UniProt human proteins with variant annotations. dbSNP variants with (sub)population frequencies. OMIM disease names and ids.

## Project Steps:
Transform and load data sources to 3NF relational data-model in MySQL.
Extract comprehensive protein and disease JSON documents using SQL selects and load to CouchDB.
Construct static HTML page web-application to search and display proteins, SNPs, and diseases.

## Project Components:
Web-Application (HTML, CSS, and JavaScript files)
Supporting document store documents (JSON documents you loaded to CouchDB)
Infrastructure for creating the documents: a) logical data-model of your relational database b) The TSV (or other files) you loaded to the relational database c) The Relational2JSON query files (.ini files)
